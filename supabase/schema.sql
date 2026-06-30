--
-- CourseVault AI Supabase Schema & Migration SQL
--
-- This script sets up profiles, courses, resources, and AI suggestions tables.
-- It also enables Row Level Security (RLS) and configures access policies.
--

-- Enable UUID generation extension if not loaded
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------------------------
-- 1. PROFILES TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read of profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

--------------------------------------------------------------------------------
-- 2. COURSES TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    course_title TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses Policies
CREATE POLICY "Users can only perform operations on their own courses" ON public.courses
    FOR ALL USING (auth.uid() = user_id);

-- Create Index for performance
CREATE INDEX idx_courses_user_id ON public.courses(user_id);

--------------------------------------------------------------------------------
-- 3. RESOURCES TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('GitHub', 'YouTube', 'PDF/Notes', 'Website', 'Practice', 'Other')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Resources Policies
CREATE POLICY "Users can only perform operations on their own resources" ON public.resources
    FOR ALL USING (auth.uid() = user_id);

-- Create Indexes for performance
CREATE INDEX idx_resources_user_id ON public.resources(user_id);
CREATE INDEX idx_resources_course_id ON public.resources(course_id);

--------------------------------------------------------------------------------
-- 4. AI SUGGESTIONS TABLE (Logs and Suggestions)
--------------------------------------------------------------------------------
CREATE TABLE public.ai_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    query TEXT NOT NULL,
    provider_used VARCHAR(50) NOT NULL,
    suggestions_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;

-- AI Suggestions Policies
CREATE POLICY "Users can only see their own suggestions" ON public.ai_suggestions
    FOR ALL USING (auth.uid() = user_id);

-- Create Indexes for performance
CREATE INDEX idx_ai_suggestions_user_id ON public.ai_suggestions(user_id);
CREATE INDEX idx_ai_suggestions_course_id ON public.ai_suggestions(course_id);

--------------------------------------------------------------------------------
-- 5. AUTOMATIC PROFILE CREATION TRIGGER
--------------------------------------------------------------------------------
-- Create profile after auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Scholar')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

--------------------------------------------------------------------------------
-- 6. AUTO UPDATED_AT TRIGGER FUNCTION
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind triggers for courses and resources
CREATE OR REPLACE TRIGGER trigger_courses_update_timestamp
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

CREATE OR REPLACE TRIGGER trigger_resources_update_timestamp
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();
