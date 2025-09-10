echo "Start building..."
npm install
npm run build 
cd dist
rm *.js
unzip worker.zip
rm worker.zip
cd ..
echo "Build completed! Files are in dist/"