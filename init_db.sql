-- 1. Chuẩn hóa Target Role
UPDATE posts SET target_role = '["Automation_QA_Engineer"]' WHERE target_role LIKE '%Automation%QA%Engineer%';
UPDATE posts SET target_role = '["Manual_QA_Engineer"]' WHERE target_role LIKE '%Manual%QA%Engineer%';
UPDATE posts SET target_role = '["QA_Leader"]' WHERE target_role LIKE '%QA%Leader%';
UPDATE posts SET target_role = '["Software_Engineer"]' WHERE target_role LIKE '%Software%Engineer%';

-- 2. Chuẩn hóa Category
UPDATE posts SET category = '["Technical"]' WHERE category LIKE '%Technical%';
UPDATE posts SET category = '["Strategic"]' WHERE category LIKE '%Strategic%';
UPDATE posts SET category = '["Analytical_Behavioral"]' WHERE category LIKE '%Analytical%Behavioral%';
UPDATE posts SET category = '["Leadership"]' WHERE category LIKE '%Leadership%';
UPDATE posts SET category = '["Foundations_Methodology"]' WHERE category LIKE '%Foundations%Methodology%';

-- 3. Chuẩn hóa Difficulty
UPDATE posts SET difficulty = 'Junior' WHERE difficulty = 'junior';
UPDATE posts SET difficulty = 'Intermediate' WHERE difficulty = 'intermediate';
UPDATE posts SET difficulty = 'Advanced' WHERE difficulty = 'advanced';