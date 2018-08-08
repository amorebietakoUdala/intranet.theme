# -*- coding: utf-8 -*-
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from plone.dexterity.interfaces import IDexterityFTI
from intranet.theme.interfaces import IPage
from intranet.theme.testing import INTRANET_THEME_INTEGRATION_TESTING  # noqa
from zope.component import createObject
from zope.component import queryUtility

import unittest


class PageIntegrationTest(unittest.TestCase):

    layer = INTRANET_THEME_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_schema(self):
        fti = queryUtility(IDexterityFTI, name='Page')
        schema = fti.lookupSchema()
        self.assertEqual(IPage, schema)

    def test_fti(self):
        fti = queryUtility(IDexterityFTI, name='Page')
        self.assertTrue(fti)

    def test_factory(self):
        fti = queryUtility(IDexterityFTI, name='Page')
        factory = fti.factory
        obj = createObject(factory)
        self.assertTrue(IPage.providedBy(obj))

    def test_adding(self):
        obj = api.content.create(
            container=self.portal,
            type='Page',
            id='Page',
        )
        self.assertTrue(IPage.providedBy(obj))
