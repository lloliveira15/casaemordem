-- Ensure every household has an invite code
UPDATE households
SET invite_code = encode(gen_random_bytes(3), 'hex')
WHERE invite_code IS NULL OR invite_code = '';
