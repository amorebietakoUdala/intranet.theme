# ============================================================================
# DEXTERITY ROBOT TESTS
# ============================================================================
#
# Run this robot test stand-alone:
#
#  $ bin/test -s intranet.theme -t test_page.robot --all
#
# Run this robot test with robot server (which is faster):
#
# 1) Start robot server:
#
# $ bin/robot-server --reload-path src intranet.theme.testing.INTRANET_THEME_ACCEPTANCE_TESTING
#
# 2) Run robot tests:
#
# $ bin/robot src/plonetraining/testing/tests/robot/test_page.robot
#
# See the http://docs.plone.org for further details (search for robot
# framework).
#
# ============================================================================

*** Settings *****************************************************************

Resource  plone/app/robotframework/selenium.robot
Resource  plone/app/robotframework/keywords.robot

Library  Remote  ${PLONE_URL}/RobotRemote

Test Setup  Open test browser
Test Teardown  Close all browsers


*** Test Cases ***************************************************************

Scenario: As a site administrator I can add a Page
  Given a logged-in site administrator
    and an add page form
   When I type 'My Page' into the title field
    and I submit the form
   Then a page with the title 'My Page' has been created

Scenario: As a site administrator I can view a Page
  Given a logged-in site administrator
    and a page 'My Page'
   When I go to the page view
   Then I can see the page title 'My Page'


*** Keywords *****************************************************************

# --- Given ------------------------------------------------------------------

a logged-in site administrator
  Enable autologin as  Site Administrator

an add page form
  Go To  ${PLONE_URL}/++add++Page

a page 'My Page'
  Create content  type=Page  id=my-page  title=My Page


# --- WHEN -------------------------------------------------------------------

I type '${title}' into the title field
  Input Text  name=form.widgets.title  ${title}

I submit the form
  Click Button  Save

I go to the page view
  Go To  ${PLONE_URL}/my-page
  Wait until page contains  Site Map


# --- THEN -------------------------------------------------------------------

a page with the title '${title}' has been created
  Wait until page contains  Site Map
  Page should contain  ${title}
  Page should contain  Item created

I can see the page title '${title}'
  Wait until page contains  Site Map
  Page should contain  ${title}
