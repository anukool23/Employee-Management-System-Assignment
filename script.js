document.addEventListener('DOMContentLoaded', async function() {
    const departmentFilter = document.getElementById('department-filter');
    const genderFilter = document.getElementById('gender-filter');
    const sortOrder = document.getElementById('sort-order');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const employeeTable = document.getElementById('employee-data');
  
    let currentPage = 1;
    let totalPages = 1;
  
    // Fetch employee data from the API
    async function fetchEmployees() {
      try {
        var url = `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees?page=${currentPage}&limit=10`;
  
        // Add filter and sorting parameters if selected
        const department = departmentFilter.value;
        const gender = genderFilter.value;
        const sort = sortOrder.value;
        const queryParams = [];
        if (department) queryParams.push(`filterBy=department&filterValue=${department}`);
        if (gender) queryParams.push(`filterBy=gender&filterValue=${gender}`);
        if (sort) queryParams.push(`sort=salary&order=${sort}`);
        if (queryParams.length > 0) url += `&${queryParams.join('&')}`;
  
        const response = await fetch(url);
        const data = await response.json();
        //console.log(data)
  
        totalPages = data.totalPages
        //console.log(totalPages)
        renderEmployees(data.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    }
  
    // Render employee data in the table
    function renderEmployees(employees) {
      employeeTable.innerHTML = '';
  
      if (employees && employees.length > 0) {
        employees.forEach((employee, index) => {
          const row = `
            <tr>
              <td>${(currentPage - 1) * 10 + index + 1}</td>
              <td>${employee.name}</td>
              <td>${employee.gender}</td>
              <td>${employee.department}</td>
              <td>${employee.salary}</td>
            </tr>
          `;
          employeeTable.insertAdjacentHTML('beforeend', row);
        });
      } else {
        employeeTable.innerHTML = '<tr><td colspan="5">No data available</td></tr>';
      }
    }
  
    // Pagination event listeners
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchEmployees();
      }
    });
  
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchEmployees();
      }
    });

    departmentFilter.addEventListener('change',()=>{
        console.log("Department filter applied")
        fetchEmployees()
    })
    genderFilter.addEventListener('change',()=>{
        console.log("Gender filter applied")
        fetchEmployees()
    })
  
    // Initial fetch on page load
    await fetchEmployees();
  });
  