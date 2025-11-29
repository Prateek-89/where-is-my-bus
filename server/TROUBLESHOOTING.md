# MongoDB Connection Troubleshooting Guide

## Common Connection Issues and Solutions

### 1. **"MONGO_URL is not defined" Error**

**Problem:** Environment variable not loaded

**Solutions:**
- ✅ Make sure `.env` file exists in the `server/` directory
- ✅ Check `.env` file has `MONGO_URL=...` (no spaces around `=`)
- ✅ Verify `.env` file is not in `.gitignore` (but don't commit it!)
- ✅ Restart your server after creating/modifying `.env`

---

### 2. **"Authentication failed" Error**

**Problem:** Wrong username or password

**Solutions:**
- ✅ Verify MongoDB Atlas username and password
- ✅ Check for special characters in password (may need URL encoding)
- ✅ Reset database user password in MongoDB Atlas
- ✅ Ensure user has proper database access permissions

**Example:**
```env
# If password has special characters like @, #, etc., they need to be URL encoded
# @ becomes %40
# # becomes %23
MONGO_URL=mongodb+srv://username:password%40%23@cluster.mongodb.net/bus-tracking
```

---

### 3. **"ENOTFOUND" or "getaddrinfo" Error**

**Problem:** Cannot resolve MongoDB hostname

**Solutions:**
- ✅ Check your internet connection
- ✅ Verify MongoDB Atlas cluster URL is correct
- ✅ Check DNS settings
- ✅ Try using IP address instead (if available)

---

### 4. **"Connection timeout" Error**

**Problem:** Cannot reach MongoDB server

**Solutions:**
- ✅ Check MongoDB Atlas Network Access (IP Whitelist)
  - Go to MongoDB Atlas → Network Access
  - Add your IP address or `0.0.0.0/0` for testing (not recommended for production)
- ✅ Check firewall settings
- ✅ Verify MongoDB Atlas cluster is running (not paused)
- ✅ Check if you're behind a corporate proxy/VPN

---

### 5. **"Invalid MONGO_URL format" Error**

**Problem:** Incorrect connection string format

**Solutions:**
- ✅ For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
- ✅ For Local MongoDB: `mongodb://localhost:27017/database-name`
- ✅ Make sure database name is included
- ✅ Check for typos in the connection string

**Correct Formats:**
```env
# MongoDB Atlas
MONGO_URL=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/bus-tracking?retryWrites=true&w=majority

# Local MongoDB
MONGO_URL=mongodb://localhost:27017/bus-tracking
```

---

### 6. **"Server selection timed out" Error**

**Problem:** Server not responding within timeout period

**Solutions:**
- ✅ Increase timeout in connection options (already set to 5s)
- ✅ Check MongoDB Atlas cluster status
- ✅ Verify network connectivity
- ✅ Check if MongoDB Atlas free tier has connection limits

---

### 7. **Connection works but disconnects frequently**

**Problem:** Connection pool or network issues

**Solutions:**
- ✅ Connection pool settings are already optimized in `db.js`
- ✅ Check MongoDB Atlas connection limits
- ✅ Monitor MongoDB Atlas metrics for connection issues
- ✅ Consider upgrading MongoDB Atlas tier if on free tier

---

## Testing Your Connection

### Step 1: Verify Environment Variables
```bash
cd server
node -e "import('dotenv').then(d => { d.default.config(); console.log('MONGO_URL:', process.env.MONGO_URL ? 'Set ✓' : 'Missing ✗'); })"
```

### Step 2: Test MongoDB Connection
```bash
cd server
npm run dev
```

Look for:
- ✅ `MongoDB Connected Successfully!`
- ✅ `Host: cluster0.xxxxx.mongodb.net`
- ✅ `Database: bus-tracking`

### Step 3: Test with MongoDB Compass (Optional)
- Download MongoDB Compass
- Use your connection string to connect directly
- If Compass works but Node.js doesn't, it's a code/configuration issue
- If Compass doesn't work, it's a MongoDB Atlas/network issue

---

## MongoDB Atlas Checklist

- [ ] Cluster is created and running (not paused)
- [ ] Database user is created with username and password
- [ ] Database user has "Read and write to any database" permission
- [ ] Network Access allows your IP address (or `0.0.0.0/0` for testing)
- [ ] Connection string is copied correctly from Atlas
- [ ] Database name is included in connection string

---

## Quick Fixes

### Fix 1: Reset Everything
```bash
# 1. Stop server (Ctrl+C)
# 2. Check .env file
cat server/.env

# 3. Verify MONGO_URL format
# 4. Restart server
cd server
npm run dev
```

### Fix 2: Test Connection String Directly
```bash
cd server
node -e "
import('mongoose').then(async (m) => {
  try {
    await m.default.connect(process.env.MONGO_URL);
    console.log('✅ Connection successful!');
    await m.default.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
});
"
```

### Fix 3: Check MongoDB Atlas Status
- Visit: https://status.mongodb.com/
- Check if there are any ongoing incidents

---

## Still Having Issues?

1. **Check server logs** - Look for specific error messages
2. **Verify MongoDB Atlas dashboard** - Check cluster status and user permissions
3. **Test with a simple connection script** - Isolate the issue
4. **Check Node.js and Mongoose versions** - Ensure compatibility

---

## Connection String Examples

### MongoDB Atlas (Recommended)
```env
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bus-tracking?retryWrites=true&w=majority
```

### Local MongoDB
```env
MONGO_URL=mongodb://localhost:27017/bus-tracking
```

### MongoDB Atlas with Options
```env
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bus-tracking?retryWrites=true&w=majority&appName=BusTrackingApp
```

---

## Need More Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Mongoose Connection Guide: https://mongoosejs.com/docs/connections.html
- Check server logs for detailed error messages

