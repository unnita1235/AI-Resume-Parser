/**
 * File Cleanup Utility
 * 
 * Automatically deletes old uploaded files to prevent disk space issues.
 * Run this as a cron job or scheduled task.
 */

const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = process.env.UPLOAD_PATH || './uploads';
const MAX_AGE_HOURS = 24; // Delete files older than 24 hours

/**
 * Delete files older than MAX_AGE_HOURS
 */
function cleanupOldFiles() {
    console.log(`[Cleanup] Starting file cleanup in ${UPLOAD_DIR}...`);

    if (!fs.existsSync(UPLOAD_DIR)) {
        console.log('[Cleanup] Upload directory does not exist. Skipping.');
        return;
    }

    const now = Date.now();
    const maxAge = MAX_AGE_HOURS * 60 * 60 * 1000; // Convert to milliseconds
    let deletedCount = 0;
    let totalSize = 0;

    try {
        const files = fs.readdirSync(UPLOAD_DIR);

        files.forEach((file) => {
            const filePath = path.join(UPLOAD_DIR, file);

            try {
                const stats = fs.statSync(filePath);

                // Check if file is older than max age
                const fileAge = now - stats.mtimeMs;

                if (fileAge > maxAge) {
                    const fileSize = stats.size;
                    fs.unlinkSync(filePath);
                    deletedCount++;
                    totalSize += fileSize;
                    console.log(`[Cleanup] Deleted: ${file} (${(fileSize / 1024).toFixed(2)} KB, age: ${(fileAge / 1000 / 60 / 60).toFixed(1)} hours)`);
                }
            } catch (fileError) {
                console.warn(`[Cleanup] Error processing ${file}:`, fileError.message);
            }
        });

        if (deletedCount > 0) {
            console.log(`[Cleanup] ✅ Deleted ${deletedCount} file(s), freed ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
        } else {
            console.log('[Cleanup] No old files to delete.');
        }
    } catch (error) {
        console.error('[Cleanup] Error during cleanup:', error.message);
    }
}

/**
 * Start automatic cleanup with specified interval
 * @param {number} intervalHours - Interval in hours between cleanup runs
 */
function startAutoCleanup(intervalHours = 6) {
    console.log(`[Cleanup] Starting automatic cleanup every ${intervalHours} hours...`);

    // Run immediately on startup
    cleanupOldFiles();

    // Schedule recurring cleanup
    const intervalMs = intervalHours * 60 * 60 * 1000;
    setInterval(cleanupOldFiles, intervalMs);
}

module.exports = {
    cleanupOldFiles,
    startAutoCleanup
};

// Run cleanup if this file is executed directly
if (require.main === module) {
    cleanupOldFiles();
}
