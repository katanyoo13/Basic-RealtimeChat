(function connect() {
    document.addEventListener('DOMContentLoaded', () => {
        let socket = io.connect("http://localhost:3000");

        let username = document.querySelector('#username');
        let usernameBtn = document.querySelector('#usernameBtn');
        let curUsername = document.querySelector('.card-header');
        let messageBox = document.querySelector('#message-box');
        let message = document.querySelector('#message');
        let messageBtn = document.querySelector('#messageBtn');
        let messageList = document.querySelector('#message-list');

        // Change username button click event
        usernameBtn.addEventListener('click', e => {
            console.log(username.value);
            socket.emit('change_username', { username: username.value });
            curUsername.textContent = username.value;
            username.value = '';
        });

        // Send message button click event
        messageBtn.addEventListener('click', e => {
            sendMessage();
        });

        // Send message on Enter key press
        message.addEventListener('keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                sendMessage();
            }
        });

        function sendMessage() {
            console.log(message.value);
            socket.emit('new_message', { message: message.value });
            message.value = '';
        }

        // Receive message event listener
        socket.on('receive_message', data => {
            console.log(data);
            displayMessage(data);
        });

        // Display message function
        function displayMessage(data) {
            let listItem = document.createElement('li');
            let messageContent = `
                <div class="message-content">
                    <span class="message-text">${data.message}</span>
                    <span class="message-time">${formatTime(new Date())}</span>
                </div>
            `;
            listItem.innerHTML = messageContent;

            // Apply appropriate class based on message sender
            if (data.username === curUsername.textContent.trim()) {
                listItem.classList.add('message', 'sent');
            } else {
                listItem.classList.add('message', 'received');
            }

            messageList.appendChild(listItem);
            messageBoxScrollToBottom();
        }

        // Helper function to format time as HH:MM AM/PM
        function formatTime(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            let strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        // Helper function to scroll message box to bottom
        function messageBoxScrollToBottom() {
            messageBox.scrollTop = messageBox.scrollHeight;
        }
    });
})();