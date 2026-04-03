-- 1. CLEANUP ALL POTENTIAL RECURSIVE POLICIES
-- Projects
DROP POLICY IF EXISTS "Admins can see everything" ON public.projects;
DROP POLICY IF EXISTS "Users can only see projects where they are members" ON public.projects;
DROP POLICY IF EXISTS "Everyone can view projects" ON public.projects;

-- Profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can edit own profile" ON public.profiles;

-- Tasks
DROP POLICY IF EXISTS "Everyone can view tasks" ON public.tasks;

-- Casting & Locations
DROP POLICY IF EXISTS "Everyone can view casting status" ON public.casting_project_status;
DROP POLICY IF EXISTS "Everyone can view location status" ON public.location_project_status;
DROP POLICY IF EXISTS "Everyone can view casting_profiles" ON public.casting_profiles;
DROP POLICY IF EXISTS "Everyone can view locations" ON public.locations;

-- 2. APPLY SIMPLE SELECT FOR EVERYONE (UNBLOCK DEMO)
CREATE POLICY "Everyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Everyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Everyone can view tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Everyone can view casting_profiles" ON public.casting_profiles FOR SELECT USING (true);
CREATE POLICY "Everyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Everyone can view casting_status" ON public.casting_project_status FOR SELECT USING (true);
CREATE POLICY "Everyone can view location_status" ON public.location_project_status FOR SELECT USING (true);

-- 3. ENABLE ALL FOR PROFILES (So users can still update themselves if needed)
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
