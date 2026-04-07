// ===== BLOXSMITH NOTIFICATION SYSTEM =====
// Handles notification bell, polling, and display

(function () {
    let notificationPollingInterval = null;
    let notificationCount = 0;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        // Wait for auth to be ready
        setTimeout(initNotifications, 500);
    });

    function initNotifications() {
        // Only init if user is logged in
        if (localStorage.getItem('bloxsmith_authenticated') !== 'true') {
            return;
        }

        // Inject notification bell into navbar
        injectNotificationBell();

        // Start polling for notifications
        startNotificationPolling();
    }

    function injectNotificationBell() {
        const userAuthArea = document.getElementById('userAuthArea');
        if (!userAuthArea) return;

        // Check if bell already exists
        if (document.getElementById('notificationBell')) return;

        // Create notification bell
        const bellContainer = document.createElement('div');
        bellContainer.id = 'notificationBell';
        bellContainer.innerHTML = `
            <div style="position: relative; cursor: pointer; padding: 10px 12px; display: flex; align-items: center; justify-content: center;" onclick="toggleNotificationDropdown()">
                <i class="fas fa-bell" style="font-size: 1rem; color: #ff8c00; transition: color 0.3s;"></i>
                <span id="notificationBadge" style="display: none; position: absolute; top: 4px; right: 4px; background: #ff5500; color: #fff; font-size: 0.6rem; font-weight: 700; padding: 2px 5px; border-radius: 10px; min-width: 14px; text-align: center;">0</span>
            </div>
        `;
        bellContainer.style.cssText = 'display: flex; align-items: center;';

        // Find the Discord button and insert bell after it
        const discordButton = userAuthArea.parentNode.querySelector('.btn-holo-discord');
        if (discordButton) {
            discordButton.insertAdjacentElement('afterend', bellContainer);
        } else {
            // Fallback: insert after userAuthArea if Discord button not found
            userAuthArea.insertAdjacentElement('afterend', bellContainer);
        }

        // Create notification dropdown
        const dropdown = document.createElement('div');
        dropdown.id = 'notificationDropdown';
        dropdown.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; color: #fff;">Notifications</span>
                <span onclick="markAllRead()" style="font-size: 0.75rem; color: #ff5500; cursor: pointer;">Mark all read</span>
            </div>
            <div id="notificationList" style="max-height: 300px; overflow-y: auto;">
                <div style="padding: 20px; text-align: center; color: #555;">Loading...</div>
            </div>
        `;
        dropdown.style.cssText = `
            display: none;
            position: fixed;
            width: 320px;
            background: linear-gradient(145deg, #0a0a0a, #000);
            border: 1px solid #333;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            z-index: 2000;
        `;
        document.body.appendChild(dropdown);
    }

    function startNotificationPolling() {
        // Initial check
        checkNotifications();

        // Poll every 30 seconds
        notificationPollingInterval = setInterval(checkNotifications, 30000);
    }

    async function checkNotifications() {
        const userData = JSON.parse(localStorage.getItem('bloxsmith_user') || '{}');
        if (!userData.id) return;

        try {
            if (typeof supabase !== 'undefined') {
                const count = await supabase.getUnreadNotificationCount(userData.id);
                updateNotificationBadge(count);
            }
        } catch (err) {
            console.error('Error checking notifications:', err);
        }
    }

    function updateNotificationBadge(count) {
        notificationCount = count;
        const badge = document.getElementById('notificationBadge');
        const bell = document.querySelector('#notificationBell i');

        if (badge) {
            if (count > 0) {
                badge.style.display = 'block';
                badge.textContent = count > 99 ? '99+' : count;
                if (bell) bell.style.color = '#ff5500';
            } else {
                badge.style.display = 'none';
                if (bell) bell.style.color = '#888';
            }
        }
    }

    // Global function to toggle notifications dropdown
    window.toggleNotificationDropdown = async function () {
        const dropdown = document.getElementById('notificationDropdown');
        const bell = document.getElementById('notificationBell');
        if (!dropdown || !bell) return;

        if (dropdown.style.display === 'none' || dropdown.style.display === '') {
            // Position dropdown under the bell
            const bellRect = bell.getBoundingClientRect();
            dropdown.style.top = (bellRect.bottom + 10) + 'px';
            dropdown.style.right = (window.innerWidth - bellRect.right) + 'px';
            dropdown.style.display = 'block';
            await loadNotifications();
        } else {
            dropdown.style.display = 'none';
        }
    };

    async function loadNotifications() {
        const userData = JSON.parse(localStorage.getItem('bloxsmith_user') || '{}');
        if (!userData.id) return;

        const list = document.getElementById('notificationList');
        if (!list) return;

        try {
            if (typeof supabase !== 'undefined') {
                const notifications = await supabase.getNotifications(userData.id, false) || [];

                if (notifications.length === 0) {
                    list.innerHTML = '<div style="padding: 30px; text-align: center; color: #555;">No notifications yet</div>';
                    return;
                }

                list.innerHTML = notifications.map(n => `
                    <div onclick="handleNotificationClick('${n.id}', '${n.link || ''}')" 
                         style="padding: 12px 15px; border-bottom: 1px solid #1a1a1a; cursor: pointer; transition: background 0.2s; ${n.is_read ? 'opacity: 0.6;' : 'background: rgba(255,85,0,0.05);'}">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-${getNotificationIcon(n.type)}" style="color: ${n.is_read ? '#555' : '#ff5500'};"></i>
                            <div style="flex: 1;">
                                <p style="color: #ccc; font-size: 0.85rem; margin: 0 0 4px 0;">${escapeHtml(n.message)}</p>
                                <span style="color: #555; font-size: 0.7rem;">${formatTimeAgo(n.created_at)}</span>
                            </div>
                            ${!n.is_read ? '<div style="width: 8px; height: 8px; background: #ff5500; border-radius: 50%;"></div>' : ''}
                        </div>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error('Error loading notifications:', err);
            list.innerHTML = '<div style="padding: 20px; text-align: center; color: #555;">Error loading notifications</div>';
        }
    }

    function getNotificationIcon(type) {
        const icons = {
            'comment': 'comment',
            'like': 'heart',
            'post_approved': 'check-circle',
            'post_rejected': 'times-circle'
        };
        return icons[type] || 'bell';
    }

    // Global function to handle notification click
    window.handleNotificationClick = async function (notificationId, link) {
        try {
            if (typeof supabase !== 'undefined') {
                await supabase.markNotificationRead(notificationId);
            }
        } catch (err) {
            console.error('Error marking notification read:', err);
        }

        // Close dropdown
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) dropdown.style.display = 'none';

        // Navigate if link provided
        if (link) {
            window.location.href = link;
        }

        // Refresh badge
        checkNotifications();
    };

    // Global function to mark all as read
    window.markAllRead = async function () {
        const userData = JSON.parse(localStorage.getItem('bloxsmith_user') || '{}');
        if (!userData.id) return;

        try {
            if (typeof supabase !== 'undefined') {
                await supabase.markAllNotificationsRead(userData.id);
                updateNotificationBadge(0);
                await loadNotifications();
            }
        } catch (err) {
            console.error('Error marking all read:', err);
        }
    };

    function formatTimeAgo(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
        return date.toLocaleDateString();
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const dropdown = document.getElementById('notificationDropdown');
        const bell = document.getElementById('notificationBell');
        if (dropdown && bell && !dropdown.contains(e.target) && !bell.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
})();
