/**
 * Mini Project 1
 * Using Class Notation
 */

// ---------------- Class Definitions ---------------- //

/**
 * Represents an assignment.
 */
class Assignment {
    constructor(title, dueDate) {
        this.title = title;
        this.dueDate = dueDate;
    }

    // Must match plainObjects.js
    printAssignment() {
        console.log('   Title: ' + this.title + ' | Due Date: ' + this.dueDate);
    }
}

/**
 * Represents a course containing assignments.
 */
class Course {
    constructor(courseName, instructor, creditHours, assignments = []) {
        this.courseName = courseName;
        this.instructor = instructor;
        this.creditHours = creditHours;
        this.assignments = assignments;
    }

    // Must match plainObjects.js
    courseInfo() {
        console.log(
            'Course: ' + this.courseName +
            ' | Instructor: ' + this.instructor +
            ' | Credit Hours: ' + this.creditHours
        );
        console.log('Assignments >>>');
        for (let a of this.assignments)
            a.printAssignment();
    }
}

// ---------------- Create Objects Using Classes ---------------- //

let a1 = new Assignment('Project Proposal', 'Jan 15');
let a2 = new Assignment('Midterm Report', 'Feb 20');
let a3 = new Assignment('Final Report', 'Mar 30');
let a4 = new Assignment('Presentation', 'Apr 10');

let c1 = new Course('Software Engineering', 'Dr. Pepper', 3, [a1, a2]);
let c2 = new Course('Data Science', 'Dr. Evil', 6, [a3, a4]);

// ---------------- Display Info ---------------- //

c1.courseInfo();
c2.courseInfo();
