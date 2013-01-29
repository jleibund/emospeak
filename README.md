emospeak
========

Emotiv application for enhanced accessibility

> npm install
> jam install (to update ui deps)

Includes foreman procfile for installation as a service - see node-foreman on github.  Use foreman to run or direct:

> ./app.sh

Uses 32-bit node for emojs and driver compatibility (64-bit not yet supported).

Point browser to http://localhost:4000

configure
=========
Requires an Emotiv EPOC to use accessibility features.  On options screen, choose your Emotiv profile file (*.emu),
located (for example in OSX) in /Users/<username>/Library/Application Support/Emotiv/Profiles/<username>.emu

Navigation uses gryo.  Selection/click is set to blink by default.  More options available on Options page.
