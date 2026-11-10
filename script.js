const studentDatabase = [
    { reg: "12602481", name: "Harsh Singh", section: "K26" },
    { reg: "12602482", name: "Rahul Kumar", section: "K26" },
    { reg: "12602501", name: "Aman Sharma", section: "K27" },
    { reg: "12603000", name: "Priya Gupta", section: "K28" },
    { reg: "12603001", name: "Sneha Verma", section: "K28" }
];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const isAnonymousCb = document.getElementById('isAnonymous');
    const studentRegInput = document.getElementById('studentReg');
    const studentPasswordInput = document.getElementById('studentPassword');
    const studentNameInput = document.getElementById('studentName');
    const studentSectionInput = document.getElementById('studentSection');
    const autocompleteList = document.getElementById('autocomplete-list');
    
    if(form) {
        studentRegInput.addEventListener('input', function() {
            const val = this.value;
            autocompleteList.innerHTML = '';
            studentNameInput.value = '';
            studentSectionInput.value = '';
            
            if (!val) return false;

            const matches = studentDatabase.filter(student => student.reg.startsWith(val));
            
            matches.forEach(student => {
                const item = document.createElement('div');
                item.innerHTML = `<strong>${student.reg.substr(0, val.length)}</strong>${student.reg.substr(val.length)}`;
                item.innerHTML += ` <small style="color:gray;">- ${student.name}</small>`;
                
                item.addEventListener('click', () => {
                    studentRegInput.value = student.reg;
                    studentNameInput.value = student.name;
                    studentSectionInput.value = student.section;
                    autocompleteList.innerHTML = ''; 
                });
                autocompleteList.appendChild(item);
            });
        });

        document.addEventListener('click', function (e) {
            if (e.target !== studentRegInput) {
                autocompleteList.innerHTML = '';
            }
        });

        isAnonymousCb.addEventListener('change', (e) => {
            if(e.target.checked) {
                studentRegInput.value = 'Anonymous';
                studentNameInput.value = 'Anonymous';
                studentSectionInput.value = 'Hidden';
                studentRegInput.disabled = true;
                document.getElementById('idError').style.display = 'none';
            } else {
                studentRegInput.value = '';
                studentNameInput.value = '';
                studentSectionInput.value = '';
                studentRegInput.disabled = false;
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if(studentPasswordInput.value !== 'abc123') {
                document.getElementById('passwordError').style.display = 'block';
                return;
            }
            document.getElementById('passwordError').style.display = 'none';

            if(!isAnonymousCb.checked && !studentNameInput.value) {
                document.getElementById('idError').style.display = 'block';
                return; 
            }
            document.getElementById('idError').style.display = 'none';

            const feedbackEntry = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                regNo: studentRegInput.value,
                name: studentNameInput.value,
                section: studentSectionInput.value,
                faculty: document.getElementById('faculty').value,
                rating: parseInt(document.getElementById('rating').value),
                comments: document.getElementById('comments').value
            };

            let feedbacks = JSON.parse(localStorage.getItem('facultyFeedbacks')) || [];
            feedbacks.push(feedbackEntry);
            localStorage.setItem('facultyFeedbacks', JSON.stringify(feedbacks));

            alert("Feedback submitted successfully!");
            form.reset();
            studentRegInput.disabled = false;
            studentNameInput.value = '';
            studentSectionInput.value = '';
        });
    }

    const tableBody = document.getElementById('tableBody');
    if(tableBody) {
        const feedbacks = JSON.parse(localStorage.getItem('facultyFeedbacks')) || [];
        
        [...feedbacks].reverse().forEach(fb => {
            const row = document.createElement('tr');
            
            let studentDisplay = 'Anonymous';
            if (fb.regNo && fb.name && fb.name !== 'Anonymous') {
                studentDisplay = `${fb.regNo} (${fb.name})`;
            } else if (fb.studentId && fb.studentId !== 'Anonymous') {
                studentDisplay = fb.studentId;
            }

            row.innerHTML = `
                <td>${fb.date}</td>
                <td>${studentDisplay}</td>
                <td>${fb.faculty}</td>
                <td>${fb.rating}/5</td>
                <td>${fb.comments}</td>
            `;
            tableBody.appendChild(row);
        });
        
        const summaryDiv = document.getElementById('ratingsSummary');
        const uniqueCourses = [...new Set(feedbacks.map(fb => fb.faculty))];

        uniqueCourses.forEach(course => {
            const courseFbs = feedbacks.filter(fb => fb.faculty === course);
            const sumRating = courseFbs.reduce((acc, curr) => acc + curr.rating, 0);
            const avg = (sumRating / courseFbs.length).toFixed(1);

            const statBox = document.createElement('div');
            statBox.className = 'stat-box';
            statBox.innerHTML = `<strong>${course}</strong><br>Avg Rating: ${avg} / 5 <br><small>(${courseFbs.length} reviews)</small>`;
            if(summaryDiv) summaryDiv.appendChild(statBox);
        });
    }
});