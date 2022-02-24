-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema serious_game
-- -----------------------------------------------------

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
  `pa_name` VARCHAR(45) NOT NULL,
  `pa_age` INT NOT NULL,
  `pa_gender` VARCHAR(45) NOT NULL,
  `pa_schooling` VARCHAR(45) NOT NULL,
  `pa_residence` VARCHAR(45) NOT NULL,
  `pa_country_of_study` VARCHAR(45) NOT NULL,
  `pa_image` BLOB NULL,
  `pa_is_deleted` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`pa_id`),
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
  `gm_description` VARCHAR(45) NULL,
  `gm_type` INT NOT NULL,
  `gm_is_deleted` TINYINT NOT NULL DEFAULT 0,
  `gr_id` INT NOT NULL,
  PRIMARY KEY (`gm_id`, `gr_id`),
  INDEX `fk_tb_game_tb_group1_idx` (`gr_id` ASC) VISIBLE,
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
  `ma_game_time` DOUBLE NULL,
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
  `adm_image` BLOB NULL,
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
  `ma_id_total` INT NOT NULL,
  `ma_id1_level` INT NOT NULL,
  PRIMARY KEY (`cron_id`, `ma_id_total`, `ma_id1_level`),
  INDEX `fk_tb_MatchCronometer_tb_match1_idx` (`ma_id_total` ASC) VISIBLE,
  INDEX `fk_tb_MatchCronometer_tb_match2_idx` (`ma_id1_level` ASC) VISIBLE,
  CONSTRAINT `fk_tb_MatchCronometer_tb_match1`
    FOREIGN KEY (`ma_id_total`)
    REFERENCES `serious_game`.`tb_match` (`ma_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_MatchCronometer_tb_match2`
    FOREIGN KEY (`ma_id1_level`)
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
-- Table `serious_game`.`tb_tmt_level`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_tmt_level` (
  `tmt_id` INT NOT NULL AUTO_INCREMENT,
  `tmt_image` BLOB NULL,
  `gm_id` INT NOT NULL,
  PRIMARY KEY (`tmt_id`, `gm_id`),
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
  `poi_id` INT NOT NULL AUTO_INCREMENT,
  `poi_diameter` DOUBLE NULL,
  `poi_left` DOUBLE NULL,
  `poi_top` DOUBLE NULL,
  `poi_ax_left` DOUBLE NULL,
  `poi_ax_top` DOUBLE NULL,
  `poi_width` DOUBLE NULL,
  `poi_height` DOUBLE NULL,
  `tmt_id` INT NOT NULL,
  PRIMARY KEY (`poi_id`, `tmt_id`),
  INDEX `fk_tb_tmt_point_tb_tmt_level1_idx` (`tmt_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_tmt_point_tb_tmt_level1`
    FOREIGN KEY (`tmt_id`)
    REFERENCES `serious_game`.`tb_tmt_level` (`tmt_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_pdp_image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_pdp_image` (
  `pdp_id` INT NOT NULL AUTO_INCREMENT,
  `pap_image` BLOB NULL,
  `pdp_selected` TINYINT NULL,
  `pdp_group` VARCHAR(45) NULL,
  `pdp_level` INT NULL,
  `gm_id` INT NOT NULL,
  PRIMARY KEY (`pdp_id`, `gm_id`),
  INDEX `fk_tb_pdp_image_tb_game1_idx` (`gm_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_pdp_image_tb_game1`
    FOREIGN KEY (`gm_id`)
    REFERENCES `serious_game`.`tb_game` (`gm_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `serious_game`.`tb_match_event`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `serious_game`.`tb_match_event` (
  `eve_id` INT NOT NULL AUTO_INCREMENT,
  `eve_time` BIGINT(20) NULL,
  `item_tag` VARCHAR(45) NULL,
  `eve_item_index` INT NULL,
  `eve_element_top` DOUBLE NULL,
  `eve_element_left` DOUBLE NULL,
  `eve_element_width` DOUBLE NULL,
  `eve_element_height` DOUBLE NULL,
  `eve_is_correct` TINYINT NULL,
  `eve_eye_x` DOUBLE NULL,
  `eve_eye_y` DOUBLE NULL,
  `poi_id` INT NOT NULL,
  `ma_id` INT NOT NULL,
  `pdp_id` INT NOT NULL,
  PRIMARY KEY (`eve_id`, `poi_id`, `ma_id`, `pdp_id`),
  INDEX `fk_tb_match_event_tb_tmt_point1_idx` (`poi_id` ASC) VISIBLE,
  INDEX `fk_tb_match_event_tb_pdp_image1_idx` (`pdp_id` ASC) VISIBLE,
  INDEX `fk_tb_match_event_tb_match1_idx` (`ma_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_match_event_tb_tmt_point1`
    FOREIGN KEY (`poi_id`)
    REFERENCES `serious_game`.`tb_tmt_point` (`poi_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_match_event_tb_pdp_image1`
    FOREIGN KEY (`pdp_id`)
    REFERENCES `serious_game`.`tb_pdp_image` (`pdp_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_match_event_tb_match1`
    FOREIGN KEY (`ma_id`)
    REFERENCES `serious_game`.`tb_match` (`ma_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

USE `serious_game` ;

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
END;$$

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
    FROM tb_adminstrator
    WHERE adm_id = user_id;
    
    SELECT COUNT(pa_id)
    INTO patient_count
    FROM tb_patient
    WHERE pa_id = user_id;
    
    IF (administrator_count + patient_count) > 0 THEN
		SELECT JSON_OBJECT('is_deleted', false) as result;
	ELSE
		DELETE FROM tb_user WHERE us_id = user_id;
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
        'image', convert(adm_image using utf8mb4)
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
CREATE PROCEDURE `delete_group`(IN _id INT)
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

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
