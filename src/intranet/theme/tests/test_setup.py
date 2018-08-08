# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from plone import api
from intranet.theme.testing import INTRANET_THEME_INTEGRATION_TESTING  # noqa

import unittest


class TestSetup(unittest.TestCase):
    """Test that intranet.theme is properly installed."""

    layer = INTRANET_THEME_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if intranet.theme is installed."""
        self.assertTrue(self.installer.isProductInstalled(
            'intranet.theme'))

    def test_browserlayer(self):
        """Test that IIntranetThemeLayer is registered."""
        from intranet.theme.interfaces import (
            IIntranetThemeLayer)
        from plone.browserlayer import utils
        self.assertIn(
            IIntranetThemeLayer,
            utils.registered_layers())


class TestUninstall(unittest.TestCase):

    layer = INTRANET_THEME_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')
        self.installer.uninstallProducts(['intranet.theme'])

    def test_product_uninstalled(self):
        """Test if intranet.theme is cleanly uninstalled."""
        self.assertFalse(self.installer.isProductInstalled(
            'intranet.theme'))

    def test_browserlayer_removed(self):
        """Test that IIntranetThemeLayer is removed."""
        from intranet.theme.interfaces import \
            IIntranetThemeLayer
        from plone.browserlayer import utils
        self.assertNotIn(
           IIntranetThemeLayer,
           utils.registered_layers())
