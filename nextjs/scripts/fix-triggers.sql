CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.household_id IS NULL THEN
    INSERT INTO public.households (name, admin_id)
    VALUES ('Minha Casa', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.handle_new_household()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.household_members (household_id, user_id, role)
  VALUES (NEW.id, NEW.admin_id, 'admin');

  UPDATE public.profiles SET household_id = NEW.id WHERE id = NEW.admin_id;

  INSERT INTO public.notification_settings (household_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

ALTER TABLE profiles ENABLE TRIGGER on_profile_created;
ALTER TABLE households ENABLE TRIGGER on_household_created;
