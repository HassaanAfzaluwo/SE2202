function Point(x, y) {
    // from Task 1
    this.x = x;
    this.y = y;

    this.print = function() {
        console.log("(" + this.x + ", " + this.y + ")");
    };

    // midpoint method
    this.midpoint = function(p2) {
        let midX = (this.x + p2.x) / 2;
        let midY = (this.y + p2.y) / 2;
        return new Point(midX, midY);
    };

    // scaleTo method
    this.scaleTo = function(p2, t) {
        let scaledX = this.x + (p2.x - this.x) * t;
        let scaledY = this.y + (p2.y - this.y) * t;
        return new Point(scaledX, scaledY);
    };
}


let p1 = new Point(1,5)
let p2 = new Point(5,7)
p1.midpoint(p2).print() // expect (3, 6)
p2.midpoint(p1).print() // expect (3, 6)


let p3 = new Point(0,0)
let p4 = new Point(4,8)
p3.scaleTo(p4,0.25).print() // expect (1, 2)
p4.scaleTo(p3, 0.75).print() // expect (1, 2)

