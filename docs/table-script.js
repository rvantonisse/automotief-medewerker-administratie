// Script used to initially render the static table
(function () {
    const tableElement = document.getElementById("table_employees");
    const tableBody = document.createElement("tbody");

    const employeeTableData = context.staff
        .map((member) => {
            // Retrieve matching employee details
            const memberEmploymentDetails = context.employmentDetails.find(
                (employmentDetail) => employmentDetail.id === member.id
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
    tableBody.innerHTML = employeeTableData.reduce(function createTableRow(
        result,
        member
    ) {
        const isInactive = !member.active;
        const statusClass = ((status) => {
            switch (status) {
                case "aanwezig":
                    return "present";

                case "afwezig":
                    return "absent";

                case "buiten":
                    return "out-of-office";

                default:
                    return "";
            }
        })(member.status);

        return (
            result +
            `
                <tr${isInactive ? ` class="inactive"` : ""}>
                    <th scope="row">${member.name} ${member.last_name}</th>
                    <td class="number">${member.id}</td>
                    <td>${member.function}</td>
                    <td>${new Date(member.employed_since).toLocaleDateString(
                        "nl"
                    )}</td>
                    <td class="status"><span class="${statusClass}">${
                member.status
            }</span></td>
                    <td>${member.remark}</td>
                    <td class="number"><span class="currency">€</span> <span class="salary">${new Number(
                        member.salary
                    ).toLocaleString("nl")}</span></td>
                </tr>`
        );
    },
    "");

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
