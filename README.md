# Perfect Mens Wear

A responsive static storefront built with HTML, CSS, and vanilla JavaScript. No build step or package installation is required.

## Run locally

Double-click `run-site.bat` on Windows, or serve this folder over HTTP (for example, `py -m http.server 8000`) and open `http://localhost:8000`. The catalogue, filters, product details, saved cart, wishlist, and recently viewed list work in the browser. Order and product enquiries open WhatsApp for the customer to review and send.

## Store configuration

Edit `site-config.js`:

- Keep the configured store WhatsApp number; replace it only with the owner's confirmed number.
- Set `phone`, `hours`, and `address` to verified shop information. They are intentionally blank until provided.
- `mapUrl` and `mapEmbedUrl` use the supplied Google Maps location. The embed point is derived from the existing directions link; replace both values only if the confirmed store listing changes.
- `storefrontImageUrl` points to the verified storefront photo (`assets/storefront.webp`) which blends elegantly into the hero section and about section.
- Set `instagramUrl` to the official profile to show the Instagram link.

The website does not make up the street address, contact phone, hours, product availability, or testimonials. The contact page uses the supplied Purandar-area location, and the catalogue is clearly marked as sample data until replaced.

## Supabase admin and live catalogue (optional)

1. Create a Supabase project and run `supabase-setup.sql` in its SQL Editor.
2. Enable email/password Auth and create the store owner's Auth user. From the SQL Editor, add only that user's Auth ID to the admin allowlist:

   ```sql
   insert into public.admin_users (user_id)
   values ('AUTH_USER_UUID');
   ```

3. Set `supabaseUrl` and the project's **publishable/anon key** in `site-config.js`. This browser key is public by design; row-level security in the supplied SQL is the access control. **Never put a service-role key in frontend code.**
4. Open `admin.html`, sign in using the authorized account, and add confirmed products, Marathi product names/categories, stock, bestseller/new-arrival flags, categories, gallery photos, store details, and banners. Uploaded images are resized and converted to WebP. The SQL provisions admin-only uploads in the public-read `product-images` bucket.

The admin app uses Supabase Auth and checks the `admin_users` allowlist. Database and Storage policies enforce permissions independently of the page. Customers may optionally consent to saving an order enquiry in Supabase; only store admins can read those records. WhatsApp-only orders are not saved to the dashboard. No payment processing is included.

## Publish

Deploy the folder as a static website over HTTPS (for example, a static host or web server), then follow the store and Supabase setup above. Add the deployed origin to Supabase Auth's allowed redirect/site URL configuration if required by the project. Test the Marathi switcher, WhatsApp links, contact/map details, and (if configured) admin RLS and image uploads before launch.
