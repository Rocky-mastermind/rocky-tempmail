# Rocky Temp Mail API

## Deploy করার ধাপ

1. **GitHub repo বানাও** এবং এই ফোল্ডারের সব ফাইল push করো:
   ```
   git init
   git add .
   git commit -m "Rocky temp mail API"
   git branch -M main
   git remote add origin https://github.com/<your-username>/rocky-tempmail.git
   git push -u origin main
   ```

2. **Vercel এ import করো**: vercel.com → New Project → GitHub repo সিলেক্ট করো → Deploy।

3. **Vercel KV যোগ করো** (email → token সংরক্ষণের জন্য, ফ্রি):
   - Project → Storage → Create Database → **KV**
   - এটা যোগ করলেই `KV_REST_API_URL` আর `KV_REST_API_TOKEN` env var অটো যোগ হয়ে যাবে।
   - এই env var ছাড়া `/api/inbox` কাজ করবে না।

4. Deploy শেষে তোমার API হবে:
   - `https://<project>.vercel.app/api/address?providers=gmail`
   - `https://<project>.vercel.app/api/inbox?email=...`

5. `tempmail-command.js` ফাইলের `API` ভ্যারিয়েবলে তোমার আসল Vercel URL বসিয়ে বট-এ ব্যবহার করো।

## গুরুত্বপূর্ণ সীমাবদ্ধতা

`providers` প্যারামিটার (gmail/outlook/hotmail/edu) শুধু **লেবেল** — ভেতরে আসল ইমেইলটা mail.tm-এর নিজস্ব ডোমেইনে তৈরি হয় (যেমন `gmail.abc123@somedomain.com`), কারণ কোনো থার্ড-পার্টি কোড দিয়ে আসল `@gmail.com`/`@outlook.com` ইনবক্সে সত্যিকারের মেইল রিসিভ করা টেকনিক্যালি সম্ভব না — ওগুলো Google/Microsoft-এর নিজস্ব সার্ভার। এটা ঠিক একই সীমাবদ্ধতা যা মূল `tempmail-api-rose` সার্ভিসেও থাকার কথা।
