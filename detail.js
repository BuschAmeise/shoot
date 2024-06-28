document.addEventListener('DOMContentLoaded', () => {
    // p5.js Sketch erstellen
    const sketch = (p) => {
        let sharks = [];
        let numbersOfSharks = 20;
        let food = [];
        let numberoffood = 40;
        var debug;

        p.setup = () => {
            p.createCanvas(1080, 720);
          
            for (let i = 0; i < numbersOfSharks; i++) {
                sharks[i] = new predator();
            }
          
            for (let i = numberoffood - 1; i >= 0; i--) {
                let x = p.random(p.width);
                let y = p.random(p.height);
                food.push(p.createVector(x, y));
            }
          
            debug = p.createCheckbox();
        };

        p.draw = () => {
            p.background(100, 150, 225);
          
            for (let i = sharks.length - 1; i >= 0; i--) {
                sharks[i].eat(food);
                sharks[i].update();
                sharks[i].applyForce();
                sharks[i].show();
              
                if (sharks.length > 0 && sharks[i].reproduce() != null) {
                    var newShark = new predator(sharks[i].childdna);
                    sharks.push(newShark);
                }
              
                if (sharks[i].dead()){
                    food.push(p.createVector(sharks[i].pos.x, sharks[i].pos.y));
                    sharks.splice(i, 1);
                }
            }
          
            if (p.random(1) < 0.05) {
                let x = p.random(p.width);
                let y = p.random(p.height);
                food.push(p.createVector(x, y));
            }
          
            for (var i = 0; i < food.length; i++) {
                p.push();
                p.stroke(20, 20, 25);
                p.fill(255, 225, 150);
                p.ellipse(food[i].x, food[i].y, 8, 8);
                p.pop();
            }
        };

        class predator {
            constructor(genes) {
                this.pos = p.createVector(p.random(0, p.width), p.random(0, p.height));
                this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
                this.acc = p.createVector(0, 0);
              
                this.maxSpeed = 5;
                this.maxSteer = 0.2;
                this.perception = 100;
                this.health = 1;
                this.mouthRadius = 1;
              
                this.dna = [];
                this.childdna = [];
              
                if (genes != null) {
                    for (let i = 0; i < genes.length; i++) {
                        this.dna[i] = genes[i];
                    }
                    this.perception *= genes[0];
                    this.maxSteer *= genes[1];
                } else {
                    this.dna[0] = p.random(0.1, 1); // perception
                    this.dna[1] = p.random(0.1, 1); // steeringForce
                    this.dna[2] = p.random(1, 2); // size
                    this.dna[3] = this.dna[2] * 10; // mouthRadius
                  
                    this.perception = this.perception * this.dna[0];
                    this.maxSteer = this.maxSteer * this.dna[1];
                }
            }

            eat(ListOfFood) {
                let smallestFoodDistance = Infinity;
                let IndexOfClosestsFood = null;
                for (let i = ListOfFood.length - 1; i >= 0; i--) {
                    let actualDistanceToFood = p.dist(this.pos.x, this.pos.y, ListOfFood[i].x, ListOfFood[i].y);
                    if (actualDistanceToFood < smallestFoodDistance && actualDistanceToFood < this.perception) {
                        smallestFoodDistance = actualDistanceToFood;
                        IndexOfClosestsFood = i;
                    }
                }
              
                if (smallestFoodDistance < this.dna[3]) {
                    ListOfFood.splice(IndexOfClosestsFood, 1);
                    if (this.health < 1) {
                        this.health += 0.2;
                    }
                } else if (IndexOfClosestsFood != null) {
                    this.seek(food[IndexOfClosestsFood]);
                }
            }

            seek(food) {
                this.desiredVelocity = p5.Vector.sub(food, this.pos);
                this.desiredVelocity.setMag(this.maxSpeed);
                this.steeringForce = this.desiredVelocity.sub(this.vel);
                this.steeringForce.limit(this.maxSteer);
                this.applyForce(this.steeringForce);
            }

            update() {
                this.vel.add(this.acc);
                this.vel.limit(this.maxSpeed);
                this.pos.add(this.vel);
                this.acc.mult(0);
              
                this.health -= 0.004;
              
                var someOtherPosition = p.createVector(p.width / 2, p.height / 2);
                var d = 25;
                if (this.pos.x < d) {
                    this.seek(someOtherPosition);
                }
                if (this.pos.x > p.width - d) {
                    this.seek(someOtherPosition);
                }    
                if (this.pos.y < d) {
                    this.seek(someOtherPosition);
                }
                if (this.pos.y > p.height - d) {
                    this.seek(someOtherPosition);
                }
            }

            dead() {
                return (this.health < 0);
            }

            reproduce() {
                var chance = 0.002;
                if (p.random(1) < chance) {
                    this.childdna = this.dna;
                    var genemix = p.random(1);
                    if (genemix < 0.25) {
                        this.childdna[0] *= 0.9;
                        this.childdna[1] *= 1.1;
                        this.childdna[2] *= p.random(0.9, 1);
                    } else if (genemix > 0.25 && genemix < 0.5){
                        this.childdna[0] *= 1.1;
                        this.childdna[1] *= 0.9;
                        this.childdna[2] *= p.random(1, 1.1);
                    } else {
                        this.childdna[0] *= 1;
                        this.childdna[1] *= 1;
                        this.childdna[2] *= 1;
                    }
                    return (1);
                } else {
                    return (null);
                }
            }

            applyForce(force) {
                this.acc.add(force);
            }

            show() {
                if (debug.checked()) {
                    p.push();
                    p.noFill();
                    p.strokeWeight(2);
                    p.stroke(0, 0, 255, 120);
                    p.circle(this.pos.x, this.pos.y, this.perception * 2);
                    p.pop();
                  
                    p.push();
                    p.noFill();
                    p.strokeWeight(2);
                    p.stroke(0, 255, 0, 120);
                    p.circle(this.pos.x, this.pos.y, this.health * 100);
                    p.pop();
                  
                    p.push();
                    p.noFill();
                    p.strokeWeight(2);
                    p.stroke(255, 0, 0, 120);
                    p.circle(this.pos.x, this.pos.y, this.dna[1] * 100);
                    p.pop();
                    p.push();
                    p.noFill();
                    p.strokeWeight(2);
                    p.stroke(255, 255, 255, 120);
                    p.circle(this.pos.x, this.pos.y, this.dna[3]);
                    p.pop();
                }

                var s = this.dna[2];
                p.push();
                p.fill(p.map(this.health, 0, 1, 255, 0), 100, 100);
                p.translate(this.pos.x, this.pos.y);
                p.rotate(this.vel.heading() + p.PI);
                p.beginShape();
                p.vertex(-2 * s, 0);
                p.vertex(0 * s, 2 * s);
                p.vertex(4 * s, 3 * s);
                p.vertex(6 * s, 6 * s);
                p.vertex(6 * s, 3 * s);
                p.vertex(14 * s, 1 * s);
                p.vertex(16.5 * s, 4 * s);
                p.vertex(16 * s, 0);
                p.vertex(16.5 * s, -4 * s);
                p.vertex(14 * s, -1 * s);
                p.vertex(6 * s, -3 * s);
                p.vertex(6 * s, -6 * s);
                p.vertex(4 * s, -3 * s);
                p.vertex(0 * s, -2 * s);
                p.vertex(-2 * s, 0);
                p.endShape();
                p.pop();
            }
        }
    };

    new p5(sketch, 'detail');
});
