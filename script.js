document.getElementById('notificationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const description = document.getElementById('notificationDescription').value;
    const interval = parseInt(document.getElementById('notificationInterval').value);

    if (description.trim() === '' || isNaN(interval) || interval <= 0) {
        alert('Preencha a descrição da notificação e um intervalo válido.');
        return;
    }

    chrome.alarms.create(description, { delayInMinutes: interval });

    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push({
        description: description,
        interval: interval
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    alert("Notificação agendada com sucesso!")

    displayNotifications();
});


function removeNotification(index) {
    const notifications = JSON.parse(localStorage.getItem('notifications'));
    notifications.splice(index, 1);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    displayNotifications();
}


function displayNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const listContainer = document.getElementById('notificationList');
    listContainer.innerHTML = '';

    for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        const listItem = document.createElement('li');
        const descriptionSpan = document.createElement('span');
        descriptionSpan.textContent = notification.description;
        const intervalSpan = document.createElement('span');
        intervalSpan.textContent = `(${notification.interval} minutos)`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', function () {
            removeNotification(i);
        });

        listItem.appendChild(descriptionSpan);
        listItem.appendChild(intervalSpan);
        listItem.appendChild(removeButton);
        listContainer.appendChild(listItem);
    }
}


displayNotifications();
