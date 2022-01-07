# 2021-12-31 plane workin

I wanna get the plate tectonics sim working again. One issue is that the og source isnt on this laptop. Not sure its in my github, either. I'll have to check the MC server when i get home, I think its there. 

It'd be a bit of a thing to start from scratch, but lets see if we can remember the outline of the src. 

Mehhhh might be tough. 

L systems? Tough w.o the wiki. 

Lets check to see if you still have that doc explorer. 

Damnit. Zeal is installed, but it only has bootstrap and html docs? Wtf I thought I pulled more than that. 

We could work on the n-gram stuff. You wanted to go back and make a 'not naieve' version. Current one runs in linear time, you could get it down to constant time if you use a map for the context->set operations. 

Yea lets try that, you don't need docs to do it.

## Cleaning up N-Gram generation.

As it stands, this does a pass over the contexts each time, lets make it a map from contexts to sets of terms. 

## Clean up Org.

Also, I'm gonna get annoyed quick at the way I'm oragnizing things. It's clear I want to have multiple examples of each 'class' of proc gen alrogirmithm, so lets just lean into that. The demos directory should have a sub directory for each class of thing, and then individual/numbered examples within them. 

Todo:

* create sub directories
* move existing html
	- update src links for the JS bundles
* update the webpack scripts?
	- Might not need this? pages just references the bundles from the shared js directory.


That will make it less gruesome to add a new random page. 

## Terrain Gen.
I'll need to make sure I have noise scripts installed. So when we're on our layover, make sure you npm install some of the perlin noise libs you've used before. I THINK if it comes to it, you can just copy/paste the relevant directories from other proc gen projects. 

## Progress!

I finished the clean up. Everything is split up by its "content type" now. I also have a working MVP of the terrain generation page. Looking good. Under 75 lines of JS? Only a few var's in there, should be easy to clean up. 