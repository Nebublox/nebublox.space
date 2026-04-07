// Supabase Client Configuration
// Used by admin panel for database operations

const SUPABASE_URL = 'https://ejsxxoilsbyxchunoeml.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqc3h4b2lsc2J5eGNodW5vZW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MDk3NjIsImV4cCI6MjA4MjE4NTc2Mn0.ZHHS7qg6VHApuqBv674qDB9SzmXWQJ5NvYnLfAtk5lo';

// Simple Supabase client for browser
const supabase = {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,

    async query(table, method = 'GET', body = null, filters = '') {
        const url = `${this.url}/rest/v1/${table}${filters}`;
        const options = {
            method,
            headers: {
                'apikey': this.key,
                'Authorization': `Bearer ${this.key}`,
                'Content-Type': 'application/json',
                'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
            }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(url, options);
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Supabase error: ${error}`);
        }

        // Handle empty responses
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    },

    // ===== USERS =====
    async getUsers() {
        return this.query('users', 'GET', null, '?order=created_at.desc');
    },

    async createUser(user) {
        return this.query('users', 'POST', user);
    },

    async updateUser(id, updates) {
        return this.query('users', 'PATCH', updates, `?id=eq.${id}`);
    },

    async deleteUser(id) {
        return this.query('users', 'DELETE', null, `?id=eq.${id}`);
    },

    // ===== ACCESS KEYS =====
    async getKeys() {
        return this.query('access_keys', 'GET', null, '?order=created_at.desc&limit=20');
    },

    async createKey(key) {
        return this.query('access_keys', 'POST', key);
    },

    // ===== ACTIVITY LOGS =====
    async getActivity(limit = 20) {
        return this.query('activity_logs', 'GET', null, `?order=created_at.desc&limit=${limit}`);
    },

    async logActivity(eventType, description, userId = null, metadata = null) {
        return this.query('activity_logs', 'POST', {
            event_type: eventType,
            description,
            user_id: userId,
            metadata
        });
    },

    // ===== VIOLATIONS =====
    async getViolations() {
        return this.query('violations', 'GET', null, '?order=created_at.desc&limit=20');
    },

    async createViolation(violation) {
        return this.query('violations', 'POST', violation);
    },

    async deleteViolation(id) {
        return this.query('violations', 'DELETE', null, `?id=eq.${id}`);
    },

    // ===== STATS =====
    async getCount(table, filters = '') {
        const url = `${this.url}/rest/v1/${table}${filters}`;
        const options = {
            method: 'HEAD',
            headers: {
                'apikey': this.key,
                'Authorization': `Bearer ${this.key}`,
                'Prefer': 'count=exact'
            }
        };
        const response = await fetch(url, options);
        if (!response.ok) return 0;

        const contentRange = response.headers.get('content-range');
        if (contentRange) {
            // Format: 0-24/100 or */100
            const total = contentRange.split('/')[1];
            return total === '*' ? 0 : parseInt(total);
        }
        return 0;
    },

    // ===== STATS =====
    async getStats() {
        // Use exact counts instead of fetching all data (which is limited to 1000)
        const [totalUsers, activeSubs, totalKeys, totalViolations] = await Promise.all([
            this.getCount('users'),
            this.getCount('users', '?plan=neq.Free&status=eq.active'),
            this.getCount('access_keys'),
            this.getCount('violations', '?resolved=is.false')
        ]);

        return {
            totalUsers: totalUsers || 0,
            activeSubs: activeSubs || 0,
            totalKeys: totalKeys || 0,
            totalViolations: totalViolations || 0
        };
    },

    // ===== SUPPORT TICKETS =====
    async getTickets(status = null) {
        // Filter out archived unless specifically requested
        const filter = status
            ? `?status=eq.${status}&order=created_at.desc`
            : `?status=neq.archived&order=created_at.desc&limit=50`;
        return this.query('support_tickets', 'GET', null, filter);
    },

    async createTicket(ticket) {
        return this.query('support_tickets', 'POST', ticket);
    },

    async updateTicket(id, updates) {
        return this.query('support_tickets', 'PATCH', updates, `?id=eq.${id}`);
    },

    async deleteTicket(id) {
        return this.query('support_tickets', 'DELETE', null, `?id=eq.${id}`);
    },

    async archiveTicket(id) {
        return this.query('support_tickets', 'PATCH', {
            status: 'archived'
        }, `?id=eq.${id}`);
    },

    async getArchivedTickets() {
        return this.query('support_tickets', 'GET', null, '?status=eq.archived&order=created_at.desc&limit=50');
    },

    async restoreTicket(id) {
        return this.query('support_tickets', 'PATCH', {
            status: 'open'
        }, `?id=eq.${id}`);
    },

    async respondToTicket(id, response, adminName = 'Admin') {
        // Update ticket with admin response and change status to 'pending' (awaiting user)
        return this.query('support_tickets', 'PATCH', {
            admin_response: response,
            responded_at: new Date().toISOString(),
            responded_by: adminName,
            status: 'pending'
        }, `?id=eq.${id}`);
    },

    async getOpenTicketCount() {
        const tickets = await this.query('support_tickets', 'GET', null, '?status=eq.open&select=id');
        return tickets?.length || 0;
    },

    // ===== FORUM POSTS =====
    async getPosts(approvedOnly = true) {
        const filter = approvedOnly
            ? '?status=eq.approved&order=created_at.desc'
            : '?order=created_at.desc';
        return this.query('forum_posts', 'GET', null, filter);
    },

    async getPendingPosts() {
        return this.query('forum_posts', 'GET', null, '?status=eq.pending&order=created_at.desc');
    },

    async getPostById(id) {
        const posts = await this.query('forum_posts', 'GET', null, `?id=eq.${id}`);
        return posts?.[0] || null;
    },

    async createPost(post) {
        return this.query('forum_posts', 'POST', {
            ...post,
            status: 'pending' // All posts start as pending for moderation
        });
    },

    async updatePostStatus(id, status, rejectionReason = null) {
        const updates = { status, updated_at: new Date().toISOString() };
        if (rejectionReason) updates.rejection_reason = rejectionReason;
        return this.query('forum_posts', 'PATCH', updates, `?id=eq.${id}`);
    },

    async likePost(postId, userId) {
        const post = await this.getPostById(postId);
        if (!post) return null;

        const likedBy = post.liked_by || [];
        const hasLiked = likedBy.includes(userId);

        const newLikedBy = hasLiked
            ? likedBy.filter(id => id !== userId)
            : [...likedBy, userId];

        return this.query('forum_posts', 'PATCH', {
            likes: newLikedBy.length,
            liked_by: newLikedBy
        }, `?id=eq.${postId}`);
    },

    async deletePost(id) {
        return this.query('forum_posts', 'DELETE', null, `?id=eq.${id}`);
    },

    // ===== FORUM COMMENTS =====
    async getComments(postId) {
        return this.query('forum_comments', 'GET', null, `?post_id=eq.${postId}&order=created_at.asc`);
    },

    async createComment(comment) {
        return this.query('forum_comments', 'POST', comment);
    },

    async deleteComment(id) {
        return this.query('forum_comments', 'DELETE', null, `?id=eq.${id}`);
    },

    // ===== NOTIFICATIONS =====
    async getNotifications(userId, unreadOnly = false) {
        const filter = unreadOnly
            ? `?user_id=eq.${userId}&is_read=eq.false&order=created_at.desc&limit=20`
            : `?user_id=eq.${userId}&order=created_at.desc&limit=50`;
        return this.query('notifications', 'GET', null, filter);
    },

    async getUnreadNotificationCount(userId) {
        const notifications = await this.query('notifications', 'GET', null,
            `?user_id=eq.${userId}&is_read=eq.false&select=id`);
        return notifications?.length || 0;
    },

    async createNotification(notification) {
        return this.query('notifications', 'POST', notification);
    },

    async markNotificationRead(id) {
        return this.query('notifications', 'PATCH', { is_read: true }, `?id=eq.${id}`);
    },

    async markAllNotificationsRead(userId) {
        return this.query('notifications', 'PATCH', { is_read: true }, `?user_id=eq.${userId}&is_read=eq.false`);
    }
};

// Make available globally
window.supabase = supabase;
