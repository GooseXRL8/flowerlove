-- Fix problematic Google Photos URL that causes errors
UPDATE profiles 
SET image_url = '/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png' 
WHERE image_url = 'https://photos.app.goo.gl/gBq2WG2ZQrbdoji99';