package config

import (
	"io/ioutil"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Env string `yaml:"env"`

	Database struct {
		Host         string `yaml:"host"`
		Port         string `yaml:"port"`
		Username     string `yaml:"username"`
		Password     string `yaml:"password"`
		DatabaseName string `yaml:"databaseName"`
	} `yaml:"database"`
	
	JWT struct {
		Secret string `yaml:"secret"`
	} `yaml:"jwt"`
	
	GoogleOAuth struct {
		ClientID     string `yaml:"client_id"`
		ClientSecret string `yaml:"client_secret"`
		RedirectURL  string `yaml:"redirect_url"`
	} `yaml:"google_oauth"`
}

func Env() (Config, error) {
	var config Config

	home := os.Getenv("ENV_PATH")
	if home == "" {
		home = "."
	}
	
	filePath := filepath.Join(home, "env.yaml")
	envData, err := ioutil.ReadFile(filePath)
	if err != nil {
		return config, err
	}

	err = yaml.Unmarshal(envData, &config)
	if err != nil {
		return config, err
	}

	return config, nil
}

/*ckage config

import (
	"io/ioutil"
	"os"
	"path/filepath"

	yaml "gopkg.in/yaml.v2"
)

type Config struct {
	Env string `yaml:"env"`

	Database struct {
		Host         string `yaml:"host"`
		Port         string `yaml:"port"`
		Username     string `yaml:"username"`
		Password     string `yaml:"password"`
		DatabaseName string `yaml:"databaseName"`
	} `yaml:"database"`
	JWT struct {
		Secret string `yaml:"secret"`
	} `yaml:"jwt"`
}

func Env() (Config, error) {
	var config Config

	home := os.Getenv("ENV_PATH")
	filePath := filepath.Join(home, "env.yaml")

	envData, err := ioutil.ReadFile(filePath)
	if err != nil {
		return config, err
	}

	err = yaml.Unmarshal(envData, &config)
	if err != nil {
		return config, err
	}

	return config, nil
}
*/