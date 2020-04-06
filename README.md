# Robot Teaching Backend

Robot Teaching is a web-based user interface for programming mobile manipulators like CHIMERA.   
The so-called "Teach-In" procedure is used to program the robot. 


The web application is based on the "MEAN" Stack and stands for   

- M        [MongoDB](https://www.mongodb.com/de)
- E        [Express.js](https://expressjs.com/de/)
- A        [Angular](https://angular.io/guide/architecture)
- N        [Node.js](https://nodejs.org/en/)   

For the documentation of the "Back-End" [JSDoc](https://jsdoc.app/) was used.     
JSDoc is a documentation tool for JavaScript applications. Basically it generates a static documentation for the application. 

To generate / update the documentation, please run the follofing command:

jsdoc -u ./tutorial/ -c ./JSDocConfig.json  --readme ./README.md

For this application the documentation was extended. Under [Tutorials](../out/tutorial-extension.html) you will find detailed instructions for adding new robot methods. 

# Backend Structure  


![JobsSelection](../screenshots/diagrammMain.png)
