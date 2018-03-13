cd /home/vmuser/FoodForThought
git pull
pkill -f "node app.js"
cd app
npm install
node app.js &
