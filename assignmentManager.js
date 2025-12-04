// Implements: Assignment, Student, Observer, ClassList, async behaviour, reminders, parallel release.

///////////////////////
// Assignment Class  //
///////////////////////

class Assignment {
  constructor(assignmentName) {
    this.assignmentName = assignmentName;
    this.status = "not assigned"; // will be: released, working, submitted, final reminder, pass, fail
    this._grade = null;           // "private" by convention
  }

  setGrade(grade) {
    this._grade = grade;

    if (grade > 50) {
      this.status = "pass";
    } else {
      this.status = "fail";
    }
  }

  hasGrade() {
    return this._grade !== null && this._grade !== undefined;
  }

  getGradeValue() {
    return this._grade;
  }
}

///////////////////////
// Observer Pattern  //
///////////////////////

class Observer {
  notify(student, assignment) {
    const studentName = student.fullName;
    const assignmentName = assignment.assignmentName;
    const status = assignment.status;
    let message = "";

    switch (status) {
      case "released":
        message = `Observer → ${studentName}, ${assignmentName} has been released.`;
        break;
      case "working":
        message = `Observer → ${studentName} is working on ${assignmentName}.`;
        break;
      case "submitted":
        message = `Observer → ${studentName} has submitted ${assignmentName}.`;
        break;
      case "final reminder":
        message = `Observer → ${studentName}, final reminder for ${assignmentName}.`;
        break;
      case "pass":
        message = `Observer → ${studentName} has passed ${assignmentName}`;
        break;
      case "fail":
        message = `Observer → ${studentName} has failed ${assignmentName}`;
        break;
      default:
        message = `Observer → ${studentName}, ${assignmentName} status: ${status}.`;
        break;
    }

    console.log(message);
  }
}

///////////////////////
// Student Class     //
///////////////////////

class Student {
  constructor(fullName, email, observer) {
    this.fullName = fullName || "";
    this.email = email || "";
    this.assignmentStatuses = []; // array of Assignment objects
    this.overallGrade = 0;
    this.observer = observer;
  }

  setFullName(name) {
    this.fullName = name;
  }

  setEmail(email) {
    this.email = email;
  }

  // --- internal helpers ---

  _findAssignment(assignmentName) {
    return this.assignmentStatuses.find(
      (a) => a.assignmentName === assignmentName
    );
  }

  _notifyObserver(assignment) {
    if (this.observer && typeof this.observer.notify === "function") {
      this.observer.notify(this, assignment);
    }
  }

  _ensureAssignmentReleased(assignmentName) {
    let assignment = this._findAssignment(assignmentName);
    if (!assignment) {
      assignment = new Assignment(assignmentName);
      assignment.status = "released";
      this.assignmentStatuses.push(assignment);
      this._notifyObserver(assignment);
    }
    return assignment;
  }

  _updateOverallGrade() {
    const gradedAssignments = this.assignmentStatuses.filter((a) =>
      a.hasGrade()
    );

    if (gradedAssignments.length === 0) {
      this.overallGrade = 0;
      return this.overallGrade;
    }

    const sum = gradedAssignments.reduce(
      (acc, a) => acc + a.getGradeValue(),
      0
    );
    this.overallGrade = sum / gradedAssignments.length;
    return this.overallGrade;
  }

  /////////////////////////////////
  // Required public methods     //
  /////////////////////////////////

  // Creates or updates the assignment.
  // If grade given -> set grade + pass/fail.
  updateAssignmentStatus(assignmentName, grade) {
    const assignment = this._ensureAssignmentReleased(assignmentName);

    if (typeof grade === "number") {
      assignment.setGrade(grade);
      this._notifyObserver(assignment);
      this._updateOverallGrade();
    }

    return assignment;
  }

  // Returns Pass / Fail / "Hasn't been assigned" (or current status if no grade yet)
  getAssignmentStatus(assignmentName) {
    const assignment = this._findAssignment(assignmentName);
    if (!assignment) {
      return "Hasn't been assigned";
    }

    if (assignment.hasGrade()) {
      return assignment.status === "pass" ? "Pass" : "Fail";
    }

    return assignment.status;
  }

  // Average grade across all assignments that have grades
  getGrade() {
    return this._updateOverallGrade();
  }

  // Start working on an assignment, then submit after 500ms (unless reminder forces early submission).
  startWorking(assignmentName) {
    const assignment = this._ensureAssignmentReleased(assignmentName);

    assignment.status = "working";
    this._notifyObserver(assignment);

    // reset submission flag & any previous timers
    if (assignment.workTimerId) {
      clearTimeout(assignment.workTimerId);
    }
    assignment._hasBeenSubmitted = false;

    assignment.workTimerId = setTimeout(() => {
      this.submitAssignment(assignmentName);
    }, 500);
  }

  // Submit assignment, then after 500ms assign random grade.
  submitAssignment(assignmentName) {
    const assignment = this._ensureAssignmentReleased(assignmentName);

    // avoid double submission
    if (assignment._hasBeenSubmitted) {
      return;
    }
    assignment._hasBeenSubmitted = true;

    // clear working timer if still pending
    if (assignment.workTimerId) {
      clearTimeout(assignment.workTimerId);
      assignment.workTimerId = null;
    }

    assignment.status = "submitted";
    this._notifyObserver(assignment);

    assignment.gradeTimerId = setTimeout(() => {
      const randomGrade = Math.floor(Math.random() * 101); // 0–100 inclusive
      this.updateAssignmentStatus(assignmentName, randomGrade);
    }, 500);
  }

  // Used by ClassList.sendReminder()
  // Sets status to "final reminder" and forces submission, even if not working yet.
  sendReminderFor(assignmentName) {
    const assignment = this._findAssignment(assignmentName);

    // if they never had this assignment, or already done, do nothing
    if (
      !assignment ||
      assignment.status === "submitted" ||
      assignment.status === "pass" ||
      assignment.status === "fail"
    ) {
      return;
    }

    assignment.status = "final reminder";
    this._notifyObserver(assignment);

    // Immediately submit after a final reminder
    this.submitAssignment(assignmentName);
  }
}

///////////////////////
// ClassList         //
///////////////////////

class ClassList {
  constructor(observer) {
    this.students = [];
    this.observer = observer;
  }

  addStudent(student) {
    this.students.push(student);
    console.log(`${student.fullName} has been added to the classlist.`);
  }

  removeStudent(fullName) {
    this.students = this.students.filter((s) => s.fullName !== fullName);
  }

  findStudentByName(fullName) {
    return this.students.find((s) => s.fullName === fullName);
  }

  // If assignmentName provided: students who have NOT yet submitted that assignment.
  // If no assignmentName: students who have ANY assignment released/working/final reminder.
  findOutstandingAssignments(assignmentName) {
    const result = [];

    if (assignmentName) {
      this.students.forEach((student) => {
        const a = student.assignmentStatuses.find(
          (as) => as.assignmentName === assignmentName
        );
        if (
          a &&
          a.status !== "submitted" &&
          a.status !== "pass" &&
          a.status !== "fail"
        ) {
          result.push(student.fullName);
        }
      });
    } else {
      this.students.forEach((student) => {
        const hasOutstanding = student.assignmentStatuses.some((a) =>
          ["released", "working", "final reminder"].includes(a.status)
        );
        if (hasOutstanding) {
          result.push(student.fullName);
        }
      });
    }

    return result;
  }

  // Release assignments in parallel (async) to all students.
  // Returns a Promise that resolves when all have been released.
  releaseAssignmentsParallel(assignmentNames) {
    const tasks = assignmentNames.map(
      (assignmentName) =>
        new Promise((resolve) => {
          // async but effectively "parallel"
          setTimeout(() => {
            this.students.forEach((student) => {
              student.updateAssignmentStatus(assignmentName);
            });
            resolve();
          }, 0);
        })
    );

    return Promise.all(tasks);
  }

  // Send reminder to all students with outstanding assignment.
  sendReminder(assignmentName) {
    this.students.forEach((student) => {
      student.sendReminderFor(assignmentName);
    });
  }
}

///////////////////////
// Exports (Node)    //
///////////////////////

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Assignment, Student, Observer, ClassList };
}
