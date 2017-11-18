'use strict';

const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');
const    MatterCollisionEvents = require('matter-collision-events');

Matter.use('matter-wrap', 'matter-attractors', 'matter-collision-events');

const    Wall = require('../common/Wall');
const    Cppn = require('../common/Cppn');
const    Plotter = require('./Plotter');
const    BrainVat = require('../common/BrainVat');
const    Bot = require('../common/Bot');
const    Plant = require('../common/Plant');

const MAX_BOTS = 60;
const MAX_PLANTS = 1000;
const WALLS = 360;


document.addEventListener('DOMContentLoaded', function(e) {



  var engine = Matter.Engine.create();

  // create a renderer
  var render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 3000,
            height: 2000,
            // showForce: true,
            // showAngleIndicator: true,
            // showCollisions: true,
            // showVelocity: true,
            wireframes: false
        }
    });

    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;


    for (let i = 0; i < WALLS; i++){
        //  let  j = i % 60 ;
        // let  k = (i % 3) - 1;
        // let  l = (i+2 % 3) - 1;
          new Wall().create(engine.world, {
            x : Math.cos(i*3.14/180) * 1500 + 1500,
            y : Math.sin(i*3.14/180)* 1000 + 1000
          });
    }

    for (let i = 0; i < MAX_BOTS; i++ ){
      new  Bot().create(engine.world, {
        x : (Math.random() -0.5) * 3000 + 1500,
        y : (Math.random() - 0.5) * 2000 + 1000
      });
    }

    for (let i = 0; i < MAX_PLANTS; i++){
      new Plant().create(engine.world, {
        x : (Math.random() -0.5) * 3000 + 1500,
        y : (Math.random() - 0.5) * 2000 + 1000
        });
    }


    Matter.Events.on(engine, "beforeUpdate", function(e){
      let botCount = 0;
      let plantCount = 0;
      let oldestBot = null;
        for (var i = 0; i < engine.world.composites.length; i++) {
          let urmom = engine.world.composites[i];
          if(urmom.gameObject != null ){
          if( urmom.gameObject.class == Bot){
            urmom.gameObject.tick();
            botCount++;
            if(oldestBot == null || oldestBot.age < urmom.gameObject.age){
              oldestBot = urmom.gameObject;
            }
          }else if ( urmom.gameObject.class == Plant){
            urmom.gameObject.tick();
            plantCount++;
          }
          }
        }
        if(botCount < MAX_BOTS){
          oldestBot.spawn();
        }
        if(plantCount < MAX_PLANTS){
          new Plant().create(engine.world, {
            x : Math.random() * 1800,
            y : Math.random() * 1600
            });
        }
    });

    Matter.Events.on(engine, "collisionStart", function(e){
          for (var i = 0; i < e.pairs.length; i++) {
            let pair = e.pairs[i];
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;
            if(bodyA.onCollide){
              bodyA.onCollide(bodyA, bodyB);
            }
            if(bodyB.onCollide){
              bodyB.onCollide(bodyB, bodyA);
            }
          }
    });

    Matter.Events.on(engine, "collisionActive", function(e){
          for (var i = 0; i < e.pairs.length; i++) {
            let pair = e.pairs[i];
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;
            if(bodyA.onCollideActive){
              bodyA.onCollideActive(bodyA, bodyB);
            }
            if(bodyB.onCollideActive){
              bodyB.onCollideActive(bodyB, bodyA);
            }
          }
    });

    var mouse = Matter.Mouse.create(render.canvas),
            mouseConstraint = Matter.MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        Matter.World.add(engine.world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;


            engine.world.bounds.min.x = 0;
            engine.world.bounds.min.y = 0;
            engine.world.bounds.max.x = 1800;
            engine.world.bounds.max.y = 1600;

  // wrapping using matter-wrap plugin
      // var allBodies = Matter.Composite.allBodies(engine.world);
      //
      // for (var i = 0; i < allBodies.length; i++) {
      //     allBodies[i].plugin.wrap = {
      //         min: { x: engine.world.bounds.min.x , y: engine.world.bounds.min.y },
      //         max: { x: engine.world.bounds.max.x , y: engine.world.bounds.max.y  }
      //     };
      // }




      // run the engine
      Matter.Engine.run(engine);

  // run the renderer
    Matter.Render.run(render);
  // create runner
    // var runner = Matter.Runner.create();
    // Matter.Runner.run(runner, engine);

});
