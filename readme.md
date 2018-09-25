# Team-4-project-1
Issues
Daniel,Tommy, and Sam worked on the front end while Thomas and Minjae worked on the backend. 
For our configuration we kept it simple using Bootstrap for our front end. Awsome font was used for the icons.  For the background image we found it on google images.
Some of the issues we had with the front end were; centering buttons, setting the background image, and  using the wrong jquery cdn. Another issue we had is centering all the items on a desktop screen even though it looked good on a phone screen. 
 
 The problem we found out with the centering of buttons was that we did not have them in a div.  After putting them in one we were able to center them.
 The way we fixed the setting of the background image is properly finding the correct file path to the image. 
 For the front end we used the compressed jquery cdn rather than the uncompressed one and changed it to the correct cdn.
 The way we fixed the desktop view was by adding an inlign block and grid.
 For the back end some of the issues 
 Libraries and frameworks
 As mentioned above we used Bootstrap, JQuery, and Awsome fonts.
 
 # Known Bugs
 * There is an array that keeps track of the recipes that have been clicked on that was made to keep track of all the recipes incase the user decides to 'favorite' a recipe. On click, a function is called to find the specific recipe in the temporary array which matches the recipes based on a unique 'id' given to all the recipes. The amount of recipe objects that can be stored in the array is unknown, but there is a limit to how much can be stored until the application runs out of memory.
 
* Issue with the formating of the recipe cards when viewed at a specific width.

* Images of the recipes appear blurry due how the image urls are given in the JSON object from the GET request; higher resolution images are avaiable, but not all recipes will have a higher resolution image.

* Duplicates of a recipe may appear depending on what is searched.
