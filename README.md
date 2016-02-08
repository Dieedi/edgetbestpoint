#Elite Dangerous Best way path helper

This small app has been build to help me go through long distance.

Usage is simple, insert starting point coordinates (approximatives) and destination coordinates (approx.)

Click button to get coordinates (and maybe systems names) in 1000ly range to make your first path.

System names are extract from EDSM database (http://www.edsm.net/)


Upgrades may comes later (re-use points, quick find coordinates with system name ...)


##About code
Simple Javascript/JQuery code

I'm using distance and middle point formula in 3 dimensions space (x,y,z) :

Distance from a to b:  ab = sqrt[(Xb-Xa)² + (Yb-Ya)² + (Zb-Za)²)]

Middle point in that distance : I = [((Xa + Xb)/2), ((Ya + Yb)/2, ((Za + Zb)/2)] 

With these informations, I've create a search function (like QuickSort) to find a point in the 1000ly range (delta)

To avoid long time searching, when coordinates are similar (0.9995 .... 0.9994 .... 0.9996 ...) I stop search and return a rounded number.

Coordinates are compared to system database and finally stored.

Then last coordinate is re-used to calculate next 1000ly coordinates

