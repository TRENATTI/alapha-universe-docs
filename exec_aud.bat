echo Test env.
cd /d C:\Users\offic\Documents\Github\Project\alapha-universe-docs
git add --all
for /f %%i in ("git diff --shortstat") do set VARIABLE=%%i
echo %VARIABLE%
git commit -m "Updater > %VARIABLE% files changed"
git push origin SiteAPI
pause