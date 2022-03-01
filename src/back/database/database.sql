-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema serious_game
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `serious_game` ;

-- -----------------------------------------------------
-- Schema serious_game
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `serious_game` DEFAULT CHARACTER SET utf8 ;
USE `serious_game` ;

-- -----------------------------------------------------
-- Table `serious_game`.`tb_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_users` (
  `us_id` INT NOT NULL AUTO_INCREMENT,
  `us_email` VARCHAR(45) NOT NULL,
  `us_password` VARCHAR(45) NOT NULL,
  `us_type` VARCHAR(45) NOT NULL DEFAULT 'Patient',
  PRIMARY KEY (`us_id`),
  UNIQUE INDEX `us_mail_UNIQUE` (`us_email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_patient` (
  `pa_id` INT NOT NULL AUTO_INCREMENT,
  `pa_passport` VARCHAR(45) NOT NULL,
  `pa_name` VARCHAR(45) NOT NULL,
  `pa_age` INT NOT NULL,
  `pa_gender` VARCHAR(45) NOT NULL,
  `pa_schooling` VARCHAR(45) NOT NULL,
  `pa_residence` VARCHAR(45) NOT NULL,
  `pa_country_of_study` VARCHAR(45) NOT NULL,
  `pa_image` VARCHAR(100) NULL,
  `pa_is_deleted` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`pa_id`),
  UNIQUE INDEX `pa_passport_UNIQUE` (`pa_passport` ASC) VISIBLE,
  CONSTRAINT `fk_tb_patient_tb_users1`
    FOREIGN KEY (`pa_id`)
    REFERENCES `serious_game`.`tb_users` (`us_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_group` (
  `gr_id` INT NOT NULL AUTO_INCREMENT,
  `gr_name` VARCHAR(45) NOT NULL,
  `gr_description` VARCHAR(200) NULL,
  `gr_is_deleted` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`gr_id`, `gr_name`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_patient_has_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_patient_has_group` (
  `pa_id` INT NOT NULL,
  `gr_id` INT NOT NULL,
  PRIMARY KEY (`pa_id`, `gr_id`),
  INDEX `fk_tb_patient_has_tb_group_tb_group1_idx` (`gr_id` ASC) VISIBLE,
  INDEX `fk_tb_patient_has_tb_group_tb_patient1_idx` (`pa_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_patient_has_tb_group_tb_patient1`
    FOREIGN KEY (`pa_id`)
    REFERENCES `serious_game`.`tb_patient` (`pa_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_patient_has_tb_group_tb_group1`
    FOREIGN KEY (`gr_id`)
    REFERENCES `serious_game`.`tb_group` (`gr_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_game` (
  `gm_id` INT NOT NULL AUTO_INCREMENT,
  `gm_name` VARCHAR(45) NOT NULL,
  `gm_maximum_attempsts` INT NOT NULL,
  `gm_description` VARCHAR(200) NULL,
  `gm_type` VARCHAR(10) NOT NULL,
  `gm_is_deleted` TINYINT NOT NULL DEFAULT 0,
  `gm_version` INT NOT NULL DEFAULT 0,
  `gr_id` INT NOT NULL,
  PRIMARY KEY (`gm_id`, `gr_id`),
  INDEX `fk_tb_game_tb_group1_idx` (`gr_id` ASC) INVISIBLE,
  INDEX `fk_tb_game_tb_group_version_idx` (`gm_version` ASC) VISIBLE,
  CONSTRAINT `fk_tb_game_tb_group1`
    FOREIGN KEY (`gr_id`)
    REFERENCES `serious_game`.`tb_group` (`gr_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_match`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_match` (
  `ma_id` INT NOT NULL AUTO_INCREMENT,
  `ma_date` DATE NULL,
  `ma_game_time` BIGINT(20) NULL,
  `ma_score` DOUBLE NULL,
  `ma_adjusted_score` DOUBLE NULL,
  `ma_eye_tracker_precision_estimate` DOUBLE NULL,
  `pa_id` INT NOT NULL,
  `gm_id` INT NOT NULL,
  PRIMARY KEY (`ma_id`, `pa_id`, `gm_id`),
  INDEX `fk_tb_match_tb_game1_idx` (`gm_id` ASC) VISIBLE,
  INDEX `fk_tb_match_tb_patient1_idx` (`pa_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_match_tb_game1`
    FOREIGN KEY (`gm_id`)
    REFERENCES `serious_game`.`tb_game` (`gm_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_match_tb_patient1`
    FOREIGN KEY (`pa_id`)
    REFERENCES `serious_game`.`tb_patient` (`pa_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_administrator`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_administrator` (
  `adm_id` INT NOT NULL AUTO_INCREMENT,
  `adm_name` VARCHAR(45) NULL,
  `adm_image` VARCHAR(100) NULL,
  PRIMARY KEY (`adm_id`),
  CONSTRAINT `fk_table_administrator_tb_users1`
    FOREIGN KEY (`adm_id`)
    REFERENCES `serious_game`.`tb_users` (`us_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_administrator_has_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_administrator_has_group` (
  `gr_id` INT NOT NULL,
  `adm_id` INT NOT NULL,
  PRIMARY KEY (`gr_id`, `adm_id`),
  INDEX `fk_tb_group_has_table_administrator_table_administrator1_idx` (`adm_id` ASC) VISIBLE,
  INDEX `fk_tb_group_has_table_administrator_tb_group1_idx` (`gr_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_group_has_table_administrator_tb_group1`
    FOREIGN KEY (`gr_id`)
    REFERENCES `serious_game`.`tb_group` (`gr_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_group_has_table_administrator_table_administrator1`
    FOREIGN KEY (`adm_id`)
    REFERENCES `serious_game`.`tb_administrator` (`adm_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_MatchCronometer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_MatchCronometer` (
  `cron_id` INT NOT NULL AUTO_INCREMENT,
  `cron_start_at` BIGINT(20) NULL,
  `cron_finish_at` BIGINT(20) NULL,
  `cron_total_time` BIGINT(20) NULL,
  `cron_game_level` INT NULL,
  `ma_id_total` INT NULL,
  `ma_id_level` INT NULL,
  PRIMARY KEY (`cron_id`),
  INDEX `fk_tb_MatchCronometer_tb_match1_idx` (`ma_id_total` ASC) VISIBLE,
  INDEX `fk_tb_MatchCronometer_tb_match2_idx` (`ma_id_level` ASC) VISIBLE,
  CONSTRAINT `fk_tb_MatchCronometer_tb_match1`
    FOREIGN KEY (`ma_id_total`)
    REFERENCES `serious_game`.`tb_match` (`ma_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_MatchCronometer_tb_match2`
    FOREIGN KEY (`ma_id_level`)
    REFERENCES `serious_game`.`tb_match` (`ma_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_eye_focus_point`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_eye_focus_point` (
  `eye_id` INT NOT NULL AUTO_INCREMENT,
  `eye_pos_x` DOUBLE NULL,
  `eye_pos_y` DOUBLE NULL,
  `eye_time_at` BIGINT(20) NULL,
  `ma_id` INT NOT NULL,
  PRIMARY KEY (`eye_id`, `ma_id`),
  INDEX `fk_tb_eye_focus_point_tb_match1_idx` (`ma_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_eye_focus_point_tb_match1`
    FOREIGN KEY (`ma_id`)
    REFERENCES `serious_game`.`tb_match` (`ma_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_pdp_image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_pdp_image` (
  `pdp_index` INT NOT NULL,
  `pdp_image` VARCHAR(100) NOT NULL,
  `pdp_selected` TINYINT NOT NULL,
  `pdp_group` VARCHAR(45) NOT NULL,
  `pdp_level` INT NOT NULL,
  `gm_id` INT NOT NULL,
  `gm_version` INT NOT NULL,
  PRIMARY KEY (`pdp_index`, `gm_id`, `gm_version`, `pdp_level`, `pdp_group`),
  INDEX `fk_tb_pdp_image_tb_game1_idx` (`gm_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_pdp_image_tb_game1`
    FOREIGN KEY (`gm_id`)
    REFERENCES `serious_game`.`tb_game` (`gm_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_tmt_level`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_tmt_level` (
  `tmt_index` INT NOT NULL,
  `tmt_image` VARCHAR(100) NULL,
  `gm_id` INT NOT NULL,
  `gm_version` INT NOT NULL,
  PRIMARY KEY (`tmt_index`, `gm_id`, `gm_version`),
  INDEX `fk_tb_tmt_level_tb_game1_idx` (`gm_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_tmt_level_tb_game1`
    FOREIGN KEY (`gm_id`)
    REFERENCES `serious_game`.`tb_game` (`gm_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_tmt_point`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_tmt_point` (
  `poi_index` INT NOT NULL,
  `poi_diameter` DOUBLE NULL,
  `poi_left` DOUBLE NULL,
  `poi_top` DOUBLE NULL,
  `poi_ax_left` DOUBLE NULL,
  `poi_ax_top` DOUBLE NULL,
  `poi_width` DOUBLE NULL,
  `poi_height` DOUBLE NULL,
  `tmt_index` INT NOT NULL,
  `gm_id` INT NOT NULL,
  `gm_version` INT NOT NULL,
  PRIMARY KEY (`poi_index`, `tmt_index`, `gm_id`, `gm_version`),
  INDEX `fk_tb_tmt_point_tb_tmt_level1_idx` (`tmt_index` ASC, `gm_id` ASC, `gm_version` ASC) VISIBLE,
  CONSTRAINT `fk_tb_tmt_point_tb_tmt_level1`
    FOREIGN KEY (`tmt_index` , `gm_id` , `gm_version`)
    REFERENCES `serious_game`.`tb_tmt_level` (`tmt_index` , `gm_id` , `gm_version`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_match_event`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_match_event` (
  `eve_id` INT NOT NULL AUTO_INCREMENT,
  `eve_time` BIGINT(20) NULL,
  `item_tag` VARCHAR(45) NULL,
  `eve_viewport_height` DOUBLE NULL,
  `eve_viewport_width` DOUBLE NULL,
  `eve_element_top` DOUBLE NULL,
  `eve_element_left` DOUBLE NULL,
  `eve_element_width` DOUBLE NULL,
  `eve_element_height` DOUBLE NULL,
  `eve_is_correct` TINYINT NULL,
  `eve_eye_x` DOUBLE NULL,
  `eve_eye_y` DOUBLE NULL,
  `ma_id` INT NOT NULL,
  `gm_id` INT NOT NULL,
  `gm_version` INT NOT NULL,
  `pdp_level` INT NULL,
  `pdp_index` INT NULL,
  `pdp_group` VARCHAR(45) NULL,
  `poi_index` INT NULL,
  `tmt_index` INT NULL,
  PRIMARY KEY (`eve_id`),
  INDEX `fk_tb_match_event_tb_match1_idx` (`ma_id` ASC) VISIBLE,
  INDEX `fk_tb_match_event_tb_pdp_image1_idx` (`pdp_index` ASC, `gm_id` ASC, `gm_version` ASC, `pdp_level` ASC, `pdp_group` ASC) VISIBLE,
  INDEX `fk_tb_match_event_tb_tmt_point1_idx` (`poi_index` ASC, `tmt_index` ASC, `gm_id` ASC, `gm_version` ASC) VISIBLE,
  CONSTRAINT `fk_tb_match_event_tb_match1`
    FOREIGN KEY (`ma_id`)
    REFERENCES `serious_game`.`tb_match` (`ma_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_match_event_tb_pdp_image1`
    FOREIGN KEY (`pdp_index` , `gm_id` , `gm_version` , `pdp_level` , `pdp_group`)
    REFERENCES `serious_game`.`tb_pdp_image` (`pdp_index` , `gm_id` , `gm_version` , `pdp_level` , `pdp_group`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_match_event_tb_tmt_point1`
    FOREIGN KEY (`poi_index` , `tmt_index` , `gm_id` , `gm_version`)
    REFERENCES `serious_game`.`tb_tmt_point` (`poi_index` , `tmt_index` , `gm_id` , `gm_version`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `serious_game` ;

-- -----------------------------------------------------
-- Placeholder table for view `serious_game`.`tmt_game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tmt_game` (`gm_id` INT, `gr_id` INT, `tmt` INT);

-- -----------------------------------------------------
-- Placeholder table for view `serious_game`.`pdp_game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`pdp_game` (`gm_id` INT, `gr_id` INT, `pdp` INT);

-- -----------------------------------------------------
-- procedure is_email_exist
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE is_email_exist(IN email VARCHAR(45))
BEGIN
   DECLARE is_exist INT;
   DECLARE result JSON;
   
   SELECT COUNT(us_email)
	INTO is_exist
    FROM tb_users
    WHERE us_email = email;
    
    set result = JSON_OBJECT('is_exist', is_exist);
    
    SELECT result;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure type_of_user
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE type_of_user(IN email varchar(45), IN password_user varchar(54))
BEGIN
    SELECT
		JSON_OBJECT('id', us_id, 'type', us_type) as user
    from
		tb_users
	WHERE
		us_email = email AND
        us_password = password_user;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_user
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE delete_user(IN user_id INT)
BEGIN
	DECLARE administrator_count INT;
    DECLARE patient_count INT;
    
    SELECT COUNT(adm_id)
    INTO administrator_count
    FROM tb_administrator
    WHERE adm_id = user_id;
    
    SELECT COUNT(pa_id)
    INTO patient_count
    FROM tb_patient
    WHERE pa_id = user_id;
    
    IF (administrator_count + patient_count) > 0 THEN
		SELECT JSON_OBJECT('is_deleted', false) as result;
	ELSE
		DELETE FROM tb_users WHERE us_id = user_id;
		SELECT JSON_OBJECT('is_deleted', true) as result;
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_administrator
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE insert_administrator(IN _administrator JSON)
BEGIN

	declare id int;
    declare user_name varchar(45);
    declare image blob;
    
    set id = _administrator ->> "$.id";
    set user_name = _administrator ->> "$.name";
    set image = _administrator ->> "$.image";
    
    insert into tb_administrator (adm_id, adm_name, adm_image) 
    value (id, user_name, image);
    
    select json_object('is_inserted', true) as result;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure register_user
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE register_user(IN email VARCHAR(45), IN password_user varchar(45), IN type_user varchar(45))
BEGIN
    INSERT INTO 
    tb_users (us_email, us_password, us_type)
    VALUES (email, password_user, type_user);
    
    SELECT JSON_OBJECT('inserted_id', last_insert_id()) as result;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_administrator
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE get_administrator(IN _id INT)
BEGIN
	select json_object(
		'id', adm_id,
        'name', adm_name,
        'image', adm_image
        ) as administrator
    from tb_administrator
    where adm_id = _id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_groups_of_administrator
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE get_groups_of_administrator (IN _admin_id INT)
BEGIN
	select 
        json_arrayagg(
			json_object('id', grp.gr_id, 'name', grp.gr_name, 'description', grp.gr_description) 
		) as group_list
    from tb_group grp
    inner join tb_administrator_has_group adm_grp
    on grp.gr_id = adm_grp.gr_id
    where 
		grp.gr_is_deleted = false and
		adm_grp.adm_id = _admin_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_group
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE insert_group(IN _new_group JSON)
BEGIN
	declare jname varchar(45);
    declare jdescription varchar(200);

	set jname = _new_group ->> "$.name";
    set jdescription = _new_group ->> "$.description";
    
    insert into tb_group (gr_name, gr_description)
    values (jname, jdescription);
    
    select last_insert_id() as inserted_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_group
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE update_group(IN _group JSON)
BEGIN
	declare _id int;
	declare _name varchar(45);
    declare _description varchar(200);
    
    set _id = _group ->> "$.id";
    set _name = _group ->> "$.name";
    set _description = _group ->> "$.description";
    
    update tb_group
    set
		gr_name = _name,
        gr_description = _description
	where
		gr_id = _id;
        
	select true as is_updated;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_group
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE delete_group(IN _id INT)
BEGIN
	update tb_group
    set gr_is_deleted = true
    where gr_id = _id;
    
    select true as is_deleted;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_group
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE get_group(IN _id INT)
BEGIN
	select
		json_object(
			'id', gr_id,
            'name', gr_name,
            'description', gr_description
		) as `group`
	from tb_group
    where
		gr_is_deleted = false and
        gr_id = _id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_administrator_to_a_group
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE add_administrator_to_a_group(IN _grou_id INT, IN _admin_id INT)
BEGIN
	INSERT INTO tb_administrator_has_group (gr_id, adm_id) 
		VALUES (_grou_id, _admin_id);
    
    select true as is_added;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure bring_patients_from_an_administrator
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE bring_patients_from_an_administrator (IN _admin_id INT)
BEGIN
select json_arrayagg(patient) as patients from
(select distinct
		json_object(
			'id', pa.pa_id,
            'passport', pa.pa_passport,
			'name', pa.pa_name,
			'age', pa.pa_age,
			'gender', pa.pa_gender,
			'schooling', pa.pa_schooling,
			'residence', pa.pa_residence,
			'country_of_study', pa.pa_country_of_study,
			'image', pa.pa_image
	) as patient
from tb_patient pa
inner join tb_patient_has_group pa_gr
	on pa.pa_id = pa_gr.pa_id
inner join tb_administrator_has_group ad_gr
	on pa_gr.gr_id = ad_gr.gr_id
where
	pa.pa_is_deleted = false and
	ad_gr.adm_id = _admin_id) tb;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_patient_to_a_group
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE add_patient_to_a_group(IN _grou_id INT, IN _patient_id INT)
BEGIN
	INSERT INTO tb_patient_has_group (gr_id, pa_id) 
		VALUES (_grou_id, _patient_id);
    
    select true as is_added;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE delete_patient(IN _id INT)
BEGIN
	update tb_patient
    set pa_is_deleted = true
    where pa_id = _id;
    
    select true as is_deleted;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_groups_of_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE get_groups_of_patient(IN _patient_id INT)
BEGIN
	select 
        json_arrayagg(
			json_object('id', grp.gr_id, 'name', grp.gr_name, 'description', grp.gr_description) 
		) as group_list
    from tb_group grp
    inner join tb_patient_has_group pa_grp
    on grp.gr_id = pa_grp.gr_id
    where 
		grp.gr_is_deleted = false and
		pa_grp.pa_id = _patient_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE get_patient(IN _id INT)
BEGIN
	select json_object(
			'id', pa.pa_id,
            'passport', pa.pa_passport,
			'name', pa.pa_name,
			'age', pa.pa_age,
			'gender', pa.pa_gender,
			'schooling', pa.pa_schooling,
			'residence', pa.pa_residence,
			'country_of_study', pa.pa_country_of_study,
			'image', pa.pa_image
		) as patient
    from tb_patient pa
    where pa_id = _id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE insert_patient(IN _patient JSON)
BEGIN
	declare _id int;
	declare _passport varchar(45);
    declare _name varchar(45);
    declare _age int;
    declare _gender varchar(45);
    declare _schooling varchar(45);
    declare _residence varchar(45);
    declare _country_of_study varchar(45);
    declare _image blob;
    
    set _id = _patient ->> "$.id";
    set _passport = _patient ->> "$.passport";
    set _name = _patient ->> "$.name";
    set _age = _patient ->> "$.age";
    set _gender = _patient ->> "$.gender";
    set _schooling = _patient ->> "$.schooling";
    set _residence = _patient ->> "$.residence";
    set _country_of_study = _patient ->> "$.country_of_study";
    set _image = _patient ->> "$.image";
    
    insert into tb_patient
    (pa_id, pa_passport, pa_name, pa_age, pa_gender, pa_schooling, pa_residence, pa_country_of_study, pa_image)
    values
    (_id, _passport, _name, _age, _gender, _schooling, _residence, _country_of_study, _image);
    
    select true as is_inserted;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE update_patient(IN _patient JSON)
BEGIN
	declare _id int;
	declare _passport varchar(45);
    declare _name varchar(45);
    declare _age int;
    declare _gender varchar(45);
    declare _schooling varchar(45);
    declare _residence varchar(45);
    declare _country_of_study varchar(45);
    declare _image blob;
    
    set _id = _patient ->> "$.id";
    set _passport = _patient ->> "$.passport";
    set _name = _patient ->> "$.name";
    set _age = _patient ->> "$.age";
    set _gender = _patient ->> "$.gender";
    set _schooling = _patient ->> "$.schooling";
    set _residence = _patient ->> "$.residence";
    set _country_of_study = _patient ->> "$.country_of_study";
    set _image = _patient ->> "$.image";
    
    update tb_patient
    set
		pa_passport = _passport, 
		pa_name = _name, 
		pa_age = _age, 
		pa_gender = _gender, 
		pa_schooling = _schooling, 
		pa_residence = _residence, 
		pa_country_of_study = _country_of_study, 
		pa_image = _image
    where
		pa_id = _id;
    
    select true as is_updated;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_game
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `insert_game`(IN _game JSON, IN _type varchar(10))
BEGIN
	declare _name varchar(45);
    declare _group_id int;
    declare _max_attempts int;
    declare _description varchar(200);
    
    set _name = _game ->> "$.name";
    set _group_id = _game ->> "$.group.id";
    set _max_attempts = _game ->> "$.maximum_attempsts";
    set _description = _game ->> "$.description";
    
    insert into tb_game
    (gm_name, gm_description, gm_maximum_attempsts, gm_type, gr_id)
    values
    (_name, _description, _max_attempts, _type, _group_id);
        
	select last_insert_id() as inserted_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_tmt
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE update_tmt(IN _tmt JSON)
BEGIN
	declare _game_id int;
	declare _name varchar(45);
    declare _group_id int;
    declare _max_attempts int;
    declare _description varchar(200);
    declare _levels json;
    declare _version int;
    
    
    declare _length_level bigint unsigned;
    declare _index_level bigint unsigned;
    declare _length_points bigint unsigned;
    declare _index_points bigint unsigned;
    declare _aux_point json;
    
    set _game_id = _tmt ->> "$.id";
    set _name = _tmt ->> "$.name";
    set _group_id = _tmt ->> "$.group.id";
    set _max_attempts = _tmt ->> "$.maximum_attempsts";
    set _description = _tmt ->> "$.description";
    set _levels = _tmt ->> "$.levels";
    
    set _length_level = json_length(_levels);
    set _index_level = 0;
    
    select gm_version
    into _version
    from tb_game
    where gm_id = _game_id;
    
    if `_length_level` > 0 then
		set _version := _version + 1;
    end if;
    
    update tb_game
    set 
		gm_name = _name,
        gm_maximum_attempsts = _max_attempts,
        gm_description = _description,
        gm_version = _version
	where gm_id = _game_id;
    
    while `_index_level` < `_length_level` do
        set _aux_point := json_extract(_levels, concat('$[', _index_level, '].points'));
		insert into tb_tmt_level (tmt_index, tmt_image, gm_id, gm_version)
        value(
			_index_level,
			JSON_UNQUOTE(json_extract(_levels, concat('$[', _index_level, '].image'))),
            _game_id,
            _version
		);
        set _index_points:= 0;
        set _length_points := json_length(_aux_point);
        while `_index_points` < `_length_points` do
			insert into tb_tmt_point (poi_index, poi_diameter, poi_left, poi_top, poi_ax_left, poi_ax_top, poi_height, poi_width, tmt_index, gm_id, gm_version)
            value(
				_index_points,
                json_extract(_aux_point, concat('$[', _index_points, '].diameter')),
                json_extract(_aux_point, concat('$[', _index_points, '].left')),
                json_extract(_aux_point, concat('$[', _index_points, '].top')),
                json_extract(_aux_point, concat('$[', _index_points, '].ax_left')),
                json_extract(_aux_point, concat('$[', _index_points, '].ax_top')),
                json_extract(_aux_point, concat('$[', _index_points, '].ax_heigth')),
                json_extract(_aux_point, concat('$[', _index_points, '].ax_width')),
                _index_level,
                _game_id,
                _version
			);
            set _index_points := _index_points + 1;
        end while;
        set _index_level := _index_level + 1;
    end while;
    
    select true as is_updated;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure bring_tmts_from_an_administrator
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `bring_tmts_from_an_administrator`(IN _admin_id INT)
BEGIN
	select 
		json_arrayagg(tmt) as tmts
	from tmt_game tmt
	inner join tb_administrator_has_group ad_gr
		on tmt.gr_id = ad_gr.gr_id
	where
		ad_gr.adm_id = _admin_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_game
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `delete_game`(IN _game_id INT)
BEGIN
	update tb_game
    set
		gm_is_deleted = true
	where
		gm_id = _game_id;
        
	select true as is_deleted;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_tmt
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `get_tmt` (IN _game_id INT)
BEGIN
	select tmt
	from tmt_game
	where gm_id = _game_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_pdp
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `update_pdp`(IN _pdp JSON)
BEGIN
	declare _game_id int;
	declare _name varchar(45);
    declare _group_id int;
    declare _max_attempts int;
    declare _description varchar(200);
    declare _levels json;
    declare _version int;
    
	declare _length_level bigint unsigned;
    declare _index_level bigint unsigned;
    declare _length_group bigint unsigned;
    declare _index_group bigint unsigned;
    declare _aux_group json;
    
	set _game_id = _pdp ->> "$.id";
    set _name = _pdp ->> "$.name";
    set _group_id = _pdp ->> "$.group.id";
    set _max_attempts = _pdp ->> "$.maximum_attempsts";
    set _description = _pdp ->> "$.description";
    set _levels = _pdp ->> "$.levels";
        
    set _length_level = json_length(_levels);
    set _index_level = 0;
    
    select gm_version
    into _version
    from tb_game
    where gm_id = _game_id;
    
    if `_length_level` > 0 then
		set _version := _version + 1;
    end if;
    
    update tb_game
    set 
		gm_name = _name,
        gm_maximum_attempsts = _max_attempts,
        gm_description = _description,
        gm_version = _version
	where gm_id = _game_id;

	while `_index_level` < `_length_level` do
        # example group ====================================================================
		set _aux_group := json_extract(_levels, concat('$[', _index_level, '].pp_example'));
        set _index_group:= 0;
        set _length_group := json_length(_aux_group);
        while `_index_group` < `_length_group` do
			#aqui el insert de los ejemplos
            insert into tb_pdp_image
            (pdp_index, pdp_image, pdp_selected, pdp_group, pdp_level, gm_id, gm_version)
            values (
				_index_group,
                JSON_UNQUOTE(json_extract(_aux_group, concat('$[', _index_group, '].image'))),
                json_extract(_aux_group, concat('$[', _index_group, '].selected')),
                'example',
                _index_level,
                _game_id,
                _version
            );
			set _index_group := _index_group + 1;
        end while;
        # aswer group ====================================================================
        set _aux_group := json_extract(_levels, concat('$[', _index_level, '].pp_answer'));
        set _index_group:= 0;
        set _length_group := json_length(_aux_group);
       while `_index_group` < `_length_group` do
			#aqui el insert de las respuestas
            insert into tb_pdp_image
            (pdp_index, pdp_image, pdp_selected, pdp_group, pdp_level, gm_id, gm_version)
            values (
				_index_group,
                JSON_UNQUOTE(json_extract(_aux_group, concat('$[', _index_group, '].image'))),
                json_extract(_aux_group, concat('$[', _index_group, '].selected')),
                'answer',
                _index_level,
                _game_id,
                _version
            );
			set _index_group := _index_group + 1;
        end while;
       set _index_level := _index_level + 1;
    end while;
    
	select true as is_updated;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure bring_pdps_from_an_administrator
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `bring_pdps_from_an_administrator`(IN _admin_id INT)
BEGIN
	select 
		json_arrayagg(pdp) as pdps
	from pdp_game pdp
	inner join tb_administrator_has_group ad_gr
		on pdp.gr_id = ad_gr.gr_id
	where
		ad_gr.adm_id = _admin_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_pdp
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `get_pdp` (IN _game_id INT)
BEGIN
	select pdp
	from pdp_game
	where gm_id = _game_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure pending_games_of_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `pending_games_of_patient`(IN _patient_id INT)
BEGIN
select 
	tg.count,
    gm.gm_maximum_attempsts,
    tmt
from
(select
	gm.gm_id,
	count(mc.ma_id) as count,
	gm.tmt
from tmt_game gm
inner join tb_patient_has_group pa_gr
	on gm.gr_id = pa_gr.gr_id
left join tb_match mc
	on gm.gm_id = mc.gm_id and pa_gr.pa_id = mc.pa_id
where
	pa_gr.pa_id = _patient_id
group by gm.tmt, gm.gm_id) tg
inner join tb_game gm
	on tg.gm_id = gm.gm_id
where
	gm.gm_maximum_attempsts > tg.count;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure pending_tmt_games_of_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `pending_tmt_games_of_patient`(IN _patient_id INT)
BEGIN
select 
	json_arrayagg(tmt) as tmts
from
(select
	gm.gm_id,
	count(mc.ma_id) as count,
	gm.tmt
from tmt_game gm
inner join tb_patient_has_group pa_gr
	on gm.gr_id = pa_gr.gr_id
left join tb_match mc
	on gm.gm_id = mc.gm_id and pa_gr.pa_id = mc.pa_id
where
	pa_gr.pa_id = _patient_id
group by gm.tmt, gm.gm_id) tg
inner join tb_game gm
	on tg.gm_id = gm.gm_id
where
	gm.gm_maximum_attempsts > tg.count;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure pending_pdp_games_of_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `pending_pdp_games_of_patient`(IN _patient_id INT)
BEGIN
select 
	json_arrayagg(pdp) as pdps
from
(select
	gm.gm_id,
	count(mc.ma_id) as count,
	gm.pdp
from pdp_game gm
inner join tb_patient_has_group pa_gr
	on gm.gr_id = pa_gr.gr_id
left join tb_match mc
	on gm.gm_id = mc.gm_id and pa_gr.pa_id = mc.pa_id
where
	pa_gr.pa_id = _patient_id
group by gm.pdp, gm.gm_id) tg
inner join tb_game gm
	on tg.gm_id = gm.gm_id
where
	gm.gm_maximum_attempsts > tg.count;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_match
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `insert_match`(IN _patient_id INT, IN _match JSON)
BEGIN
	declare _game_id int;
	declare _date date;
    declare _game_time bigint(20);
    declare _score double;
    declare _eye_tracker_precision double;
    declare _game_cronometer json;
    declare _levels_cronometers json;
    declare _events json;
    declare _eye_traking json;
    
    declare _match_id int;
    declare _game_version int;
    declare _game_type varchar(10);
    declare _pdp_aux varchar(45);
    
    declare _index int;
    declare _max_index int;
    
    set _game_id = _match ->> "$.game.id";
    set _date = STR_TO_DATE(_match ->> "$.date", "%d/%m/%Y");
    set _game_time = _match ->> "$.game_time";
    set _score = _match ->> "$.score";
    set _eye_tracker_precision = _match ->> "$.eye_tracker_precision_estimate";
	set _game_cronometer = _match ->> "$.game_cronometer";
    set _levels_cronometers = _match ->> "$.levels_cronometers";
    set _events = _match ->> "$.events";
    set _eye_traking = _match ->> "$.eye_traking";
    
SELECT 
    gm_version, gm_type
INTO _game_version , _game_type FROM
    tb_game
WHERE
    gm_id = _game_id;
    
    insert into tb_match (ma_date, ma_game_time, ma_score, ma_eye_tracker_precision_estimate, pa_id, gm_id)
    values (_date, _game_time, _score, _eye_tracker_precision, _patient_id, _game_id);
    
    set _match_id = last_insert_id();
    
    #Cronometer of total game
    insert into tb_MatchCronometer (cron_start_at, cron_finish_at, cron_total_time, ma_id_total)
    values ( 
		_game_cronometer ->> "$.start",
        _game_cronometer ->> "$.finish",
        _game_cronometer ->> "$.total_time",
        _match_id
        );
    
    #Cronometer of each level
    set _index = 0;
    set _max_index = json_length( JSON_KEYS(_levels_cronometers));
    
    while `_index` < `_max_index` do
		insert into tb_MatchCronometer (cron_start_at, cron_finish_at, cron_total_time, cron_game_level, ma_id_level)
		values ( 
			json_extract(_levels_cronometers, concat('$."', _index, '".start')),
			json_extract(_levels_cronometers, concat('$."', _index, '".finish')),
			json_extract(_levels_cronometers, concat('$."', _index, '".total_time')),
            _index,
			_match_id
			);
		set _index := _index + 1;
    end while;
    
    #Position of eyes
    set _index = 0;
    set _max_index = json_length(_eye_traking);
    
    while `_index` < `_max_index` do
		insert into tb_eye_focus_point (eye_pos_x, eye_pos_y, eye_time_at, ma_id)
		values ( 
			json_extract(_eye_traking, concat('$[', _index, '].x')),
			json_extract(_eye_traking, concat('$[', _index, '].y')),
			json_extract(_eye_traking, concat('$[', _index, '].time')),
			_match_id
			);
		set _index := _index + 1;
    end while;
    
        #Events
    set _index = 0;
    set _max_index = json_length(_events);
    
    while `_index` < `_max_index` do
    
		if _game_type = 'tmt' then
			insert into tb_match_event (eve_time, item_tag, eve_viewport_height, eve_viewport_width, eve_element_top, eve_element_left, eve_element_width, eve_element_height, eve_is_correct, eve_eye_x, eve_eye_y, ma_id, gm_id, gm_version, tmt_index, poi_index)
			values ( 
				json_extract(_events, concat('$[', _index, '].time')),
				json_extract(_events, concat('$[', _index, '].item_tag')),
				json_extract(_events, concat('$[', _index, '].vewport_height')),
                json_extract(_events, concat('$[', _index, '].vewport_width')),
                json_extract(_events, concat('$[', _index, '].element_top')),
                json_extract(_events, concat('$[', _index, '].element_left')),
                json_extract(_events, concat('$[', _index, '].vewport_width')),
                json_extract(_events, concat('$[', _index, '].element_height')),
                json_extract(_events, concat('$[', _index, '].is_correct')),
                json_extract(_events, concat('$[', _index, '].eye_position.x')),
                json_extract(_events, concat('$[', _index, '].eye_position.y')),
				_match_id,
                _game_id,
                _game_version,
                json_extract(_events, concat('$[', _index, '].level_id')),
                json_extract(_events, concat('$[', _index, '].item_index'))
				);
		else
			if json_extract(_events, concat('$[', _index, '].item_tag')) = 'pp_example' then
				set _pdp_aux = 'example';
			else 
				set _pdp_aux = 'answer';
            end if;
			insert into tb_match_event (eve_time, item_tag, eve_viewport_height, eve_viewport_width, eve_element_top, eve_element_left, eve_element_width, eve_element_height, eve_is_correct, eve_eye_x, eve_eye_y, ma_id, gm_id, gm_version, pdp_level, pdp_index, pdp_group)
			values ( 
				json_extract(_events, concat('$[', _index, '].time')),
				json_extract(_events, concat('$[', _index, '].item_tag')),
				json_extract(_events, concat('$[', _index, '].vewport_height')),
                json_extract(_events, concat('$[', _index, '].vewport_width')),
                json_extract(_events, concat('$[', _index, '].element_top')),
                json_extract(_events, concat('$[', _index, '].element_left')),
                json_extract(_events, concat('$[', _index, '].vewport_width')),
                json_extract(_events, concat('$[', _index, '].element_height')),
                json_extract(_events, concat('$[', _index, '].is_correct')),
                json_extract(_events, concat('$[', _index, '].eye_position.x')),
                json_extract(_events, concat('$[', _index, '].eye_position.y')),
				_match_id,
                _game_id,
                _game_version,
                json_extract(_events, concat('$[', _index, '].level_id')),
                json_extract(_events, concat('$[', _index, '].item_index')),
                _pdp_aux
				);

        end if;
		set _index := _index + 1;
    end while;
SELECT TRUE AS is_inserted;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_match_by_patient
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `get_match_by_patient`(IN _patient_id INT)
BEGIN
	select 
	json_arrayagg(
		json_object(
			'id', ma.ma_id,
			'game', json_object('id', gm.gm_id, 'name', gm.gm_name, 'group', gm.gr_id),
			'date', DATE_FORMAT(ma.ma_date,'%d/%m/%Y'),
			'game_time', ma.ma_game_time,
			'score', ma.ma_score,
			'adjusted_score', ma.ma_adjusted_score,
			'eye_tracker_precision_estimate', ma.ma_eye_tracker_precision_estimate
			)
        ) as matchs
from tb_match ma
inner join tb_game gm
	on ma.gm_id = gm.gm_id
where ma.pa_id = _patient_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_adjusted_score_of_match
-- -----------------------------------------------------

DELIMITER $$
USE `serious_game`$$
CREATE PROCEDURE `update_adjusted_score_of_match`(IN _match_id INT, IN _adjusted_score DOUBLE)
BEGIN
	update tb_match
    set ma_adjusted_score = _adjusted_score
    where ma_id = _match_id;
	select true as is_updated;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `serious_game`.`tmt_game`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `serious_game`.`tmt_game`;
USE `serious_game`;
CREATE  OR REPLACE VIEW `tmt_game` AS
    SELECT 
        gm.gm_id,
        gm.gr_id,
        JSON_OBJECT('id',
                gm.gm_id,
                'name',
                gm.gm_name,
                'description',
                gm.gm_description,
                'maximum_attempsts',
                gm.gm_maximum_attempsts,
                'group',
                gm.gr_id,
                'levels',
                tl._level) AS tmt
    FROM
        (SELECT 
            lv.gm_id,
                lv.gm_version,
                JSON_ARRAYAGG(JSON_OBJECT('index', lv.tmt_index, 'image', lv.tmt_image, 'points', tp._point)) AS _level
        FROM
            (SELECT 
            poi.tmt_index,
                poi.gm_id,
                poi.gm_version,
                JSON_ARRAYAGG(JSON_OBJECT('index', poi_index, 'diameter', poi_diameter, 'left', poi_left, 'top', poi_top, 'ax_left', poi_ax_left, 'ax_top', poi_ax_top, 'ax_width', poi_width, 'ax_heigth', poi_height)) AS _point
        FROM
            tb_tmt_point poi
        GROUP BY poi.tmt_index , poi.gm_id , poi.gm_version) tp
        RIGHT JOIN tb_tmt_level lv ON tp.tmt_index = lv.tmt_index
            AND tp.gm_id = lv.gm_id
            AND tp.gm_version = lv.gm_version
        GROUP BY lv.gm_id , lv.gm_version) tl
            RIGHT JOIN
        tb_game gm ON tl.gm_id = gm.gm_id
            AND tl.gm_version = gm.gm_version
    WHERE
        gm.gm_is_deleted = FALSE
            AND gm.gm_type = 'tmt';

-- -----------------------------------------------------
-- View `serious_game`.`pdp_game`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `serious_game`.`pdp_game`;
USE `serious_game`;
CREATE  OR REPLACE VIEW `pdp_game` AS
    SELECT 
        gm.gm_id,
        gm.gr_id,
        JSON_OBJECT('id',
                gm.gm_id,
                'name',
                gm.gm_name,
                'description',
                gm.gm_description,
                'maximum_attempsts',
                gm.gm_maximum_attempsts,
                'group',
                gm.gr_id,
                'levels',
                lv._game_levels) AS pdp
    FROM
        (SELECT 
            gm1.gm_id, JSON_ARRAYAGG(tb_lv._level) _game_levels
        FROM
            (SELECT 
            img_e.pdp_level,
                img_e.gm_id,
                img_e.gm_version,
                JSON_OBJECT('pp_example', img_e._image, 'pp_answer', img_a._image) AS _level
        FROM
            (SELECT 
            pdp.pdp_group,
                pdp.pdp_level,
                pdp.gm_id,
                pdp.gm_version,
                JSON_ARRAYAGG(JSON_OBJECT('image', pdp.pdp_image, 'selected', pdp.pdp_selected)) AS _image
        FROM
            tb_pdp_image pdp
        WHERE
            pdp.pdp_group = 'example'
        GROUP BY pdp.pdp_group , pdp.pdp_level , pdp.gm_id , pdp.gm_version) img_e
        JOIN (SELECT 
            pdp.pdp_group,
                pdp.pdp_level,
                pdp.gm_id,
                pdp.gm_version,
                JSON_ARRAYAGG(JSON_OBJECT('image', pdp.pdp_image, 'selected', pdp.pdp_selected)) AS _image
        FROM
            tb_pdp_image pdp
        WHERE
            pdp.pdp_group = 'answer'
        GROUP BY pdp.pdp_group , pdp.pdp_level , pdp.gm_id , pdp.gm_version) img_a ON img_e.pdp_level = img_a.pdp_level
            AND img_e.gm_id = img_a.gm_id
            AND img_e.gm_version = img_a.gm_version) tb_lv
        RIGHT JOIN tb_game gm1 ON gm1.gm_id = tb_lv.gm_id
            AND gm1.gm_version = tb_lv.gm_version
        WHERE
            gm1.gm_type = 'pdp'
        GROUP BY gm1.gm_id) lv
            RIGHT JOIN
        tb_game gm ON lv.gm_id = gm.gm_id
    WHERE
        gm.gm_is_deleted = FALSE
            AND gm.gm_type = 'pdp';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
