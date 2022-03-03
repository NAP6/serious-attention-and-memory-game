import { AdministratorController } from '../../controller/AdministratorController.js';

var data_row = await AdministratorController.get_n_patietns_by_group();

if(data_row.length > 0) {
    document.getElementById('no-data').classList.add('d-none');
    document.getElementById('chart').classList.remove('d-none');
    const ctx = document.getElementById('groups_chart');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data_row.map((d) => { return Object.keys(d)[0]; }),
            datasets: [
                {
                    label: '# de Pacientes',
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
                    borderColor: "#4e73df",
                    data: data_row.map((d) => { return Object.values(d)[0]; }),
                }
            ]
        },
    options: {
        maintainAspectRatio: false,
        layout: {
        padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
        }
        },
        legend: {
        display: false
        },
        tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        },
    }
    });
}