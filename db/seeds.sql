INSERT INTO department (deptname)
VALUES
  ('Frontend'),
  ('Backend');
INSERT INTO jobrole (title, salary, department_id)
VALUES
  ('Frontend Manager', 34000, 1),
  ('Backend Manager', 37000, 2),
  ('Cashier', 20000, 1),
  ('Greeter', 18000, 1),
  ('Chef', 25000, 2),
  ('Prepper', 22000, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Michael', 'Jordan', 1, NULL),
  ('Magic', 'Johnson', 2, NULL),
  ('Scottie', 'Pippen', 3, 1),
  ('Clyde', 'Drexler', 3, 1),
  ('Charles', 'Barkley', 4, 1),
  ('John', 'Stockton', 4, 1),
  ('Chris', 'Mullin', 4, 1),
  ('David', 'Robinson', 5, 2),
  ('Karl', 'Malone', 5, 2),
  ('Patrick', 'Ewing', 6, 2),
  ('Larry', 'Bird', 6, 2),
  ('Christian', 'Laettner', 6, 2);