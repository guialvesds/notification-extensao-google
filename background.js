function showNotification(description) {
    chrome.notifications.create('', {
        type: 'basic',
        title: 'Lembrete',
        message: description,
        iconUrl: 'icon48.png'
    });
}

function scheduleNextNotification() {
    chrome.alarms.getAll(function(alarms) {
        alarms.forEach(function(alarm) {
            const { name, periodInMinutes } = alarm;

            chrome.alarms.create(name, { delayInMinutes: periodInMinutes });
        });
    });
}

chrome.alarms.onAlarm.addListener(function(alarm) {
    showNotification(alarm.name);
});

function scheduleNotification(description, interval) {
    chrome.alarms.create(description, { delayInMinutes: interval, periodInMinutes: interval }, function() {
        scheduleNextNotification();
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'scheduleNotification') {
        const { description, interval } = request;
        scheduleNotification(description, interval);
        sendResponse({ message: 'Notificação agendada.' });
        return true;
    }
});


scheduleNextNotification();
