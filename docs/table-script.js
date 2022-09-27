// Script used to initially render the static table
(function () {
    const tableElement =
        document.getElementById("table_employees");
    const tableBody = document.createElement("tbody");

    const employeeTableData = context.staff
        .map((member) => {
            // Retrieve matching employee details
            const memberEmploymentDetails =
                context.employmentDetails.find(
                    (employmentDetail) =>
                        employmentDetail.id === member.id
                );

            // Return a new object with all employee keys flattened for the table
            return {
                ...member,
                ...memberEmploymentDetails.details,
                remark: memberEmploymentDetails.remark,
            };
        })
        .sort((a, b) => by("id")(a, b));

    // Build the table body
    tableBody.innerHTML = employeeTableData.reduce(
        function createTableRow(result, member) {
            return (
                result +
                `
                <tr>
                    <td>${member.name} ${member.last_name}</td>
                    <td>${member.id}</td>
                    <td>${member.function}</td>
                    <td>${member.employed_since}</td>
                    <td>${member.status}</td>
                    <td>${member.remark}</td>
                    <td><span>€</span> ${member.salary}</td>
                </tr>`
            );
        },
        ""
    );

    tableElement.append(tableBody);

    function by(key, desc = false) {
        return function (a, b) {
            const aVal = a[key];
            const bVal = b[key];

            if (aVal < bVal) {
                return desc ? 1 : -1;
            }

            if (aVal > bVal) {
                return desc ? -1 : 1;
            }

            return 0;
        };
    }
})();
