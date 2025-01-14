#!/bin/bash
rsync --exclude-from=.gitignore --exclude=.git -av ./ bertrand@server:/web/slack.vandelayindustries.online/
scp config/prod.json5 bertrand@server:/web/slack.vandelayindustries.online/config/
