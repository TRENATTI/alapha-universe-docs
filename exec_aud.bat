echo Test env.
cd /d C:\Users\offic\Documents\Github\Project\alapha-universe-docs
git add --all
git diff --shortstat @~ > difference.txt
set /p files_changed=<difference.txt
echo %files_changed%
git commit -m "Updater > %files_changed%"
git push origin SiteAPI