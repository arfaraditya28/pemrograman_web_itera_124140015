import os
import shutil
import tempfile
import unittest

import transaction
from pyramid import testing

from pyramid_mahasiswa.models import get_tm_session
from pyramid_mahasiswa.models.meta import Base


def dummy_request(dbsession):
    return testing.DummyRequest(dbsession=dbsession)


class BaseTest(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.mkdtemp()
        db_url = 'sqlite:///' + os.path.join(self.tempdir, 'test.sqlite')

        self.config = testing.setUp(
            settings={'sqlalchemy.url': db_url}
        )
        self.config.include('pyramid_mahasiswa.models')

        session_factory = self.config.registry['dbsession_factory']
        self.engine = session_factory.kw['bind']
        self.session = get_tm_session(
            session_factory, transaction.manager
        )

    def init_database(self):
        Base.metadata.create_all(self.engine)

    def tearDown(self):
        testing.tearDown()
        transaction.abort()
        self.engine.dispose()
        shutil.rmtree(self.tempdir, ignore_errors=True)


class TestMyViewSuccessCondition(BaseTest):
    def setUp(self):
        super().setUp()
        self.init_database()

        from pyramid_mahasiswa.models import MyModel

        model = MyModel(name='one', value=55)
        self.session.add(model)

    def test_passing_view(self):
        from pyramid_mahasiswa.views.default import my_view

        info = my_view(dummy_request(self.session))
        self.assertEqual(info['one'].name, 'one')
        self.assertEqual(info['project'], 'pyramid_mahasiswa')


class TestMyViewFailureCondition(BaseTest):
    def test_failing_view(self):
        from pyramid_mahasiswa.views.default import my_view

        info = my_view(dummy_request(self.session))
        self.assertEqual(info.status_int, 500)
