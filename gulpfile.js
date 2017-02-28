'use strict';

/**
 * gulpfile.js
 * ===========
 * Rather than manage one giant configuration file responsible
 * for creating multiple tasks, each task has been broken out into
 * its own file in gulp/tasks. Any file in that folder gets automatically
 * required by the loop in ./gulp/index.js (required below).

 * To add a new task, simply add a new task file to gulp/tasks.
 */

require('./gulp');
var stuff = 5;

if(stuff < 5) {
    console.log("hi");
} else {
    stuff = 6;

    var thing= 'hu';

    let stuff = 'hi';
    console.log("maybe");
}

if(stuff === 6){
    let i;
	i + 1;
    eval(5);
    eval(6);
}

var ObjectFun = {
    hats: 2,
}

if(Object.Fun.hats){

}

ObjectFun.shoes = 3;
