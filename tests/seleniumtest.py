# -*- coding: utf-8 -*-
from selenium.webdriver.firefox import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time

#User testing
def user_registration(user_name, email, password, confirm_password):
    form = browser.find_element_by_id("register-form")
    name_box = form.find_element_by_name("name")
    email_box = form.find_element_by_name("email")
    password_box = form.find_element_by_name("password")
    confirm_pw_box = form.find_element_by_name("password_again")
    name_box.clear()
    email_box.clear()
    password_box.clear()
    confirm_pw_box.clear()
    name_box.send_keys(user_name)
    email_box.send_keys(email)
    password_box.send_keys(password)
    confirm_pw_box.send_keys(confirm_password)
    form.submit()
    time.sleep(1)

def logout():
    browser.find_element_by_id("logout").click()
    time.sleep(1)

def login(email, password, browser):
    form = browser.find_element_by_id("login-form")
    email_box = form.find_element_by_name("email")
    password_box = form.find_element_by_name("password")
    sign_in_box = form.find_element_by_name("sign_in")
    email_box.clear()
    password_box.clear()
    email_box.send_keys(email)
    password_box.send_keys(password)
    sign_in_box.submit()
    time.sleep(1)

def add_friend(name):
    find_user(name)
    browser.find_element_by_id("befriend").click()
    time.sleep(1)

def remove_friend(name):
    find_user(name)
    browser.find_element_by_id("unfriend").click()
    time.sleep(1)

def view_friends():
    browser.find_element_by_id("friends-button").click()
    time.sleep(1)
def view_wall():
    browser.find_element_by_id("wall-button").click()
    time.sleep(1)

def view_profile():
    browser.find_element_by_id("myprofile-button").click()
    time.sleep(1)

def view_friends_profile():
    view_friends()
    friend = browser.find_element_by_class_name("friend")
    friend.find_element_by_xpath('./*').click()
    time.sleep(1)

#testing search
def find_user(name):
    search_field= browser.find_element_by_id("search-input")
    search_button = browser.find_element_by_id("search-button")
    search_field.clear()
    search_field.send_keys(name)
    search_button.click()
    time.sleep(1)
    search_hits = browser.find_element_by_id("search-cleaner")
    search_hit = search_hits.find_element_by_xpath('./*')
    search_hit.find_element_by_xpath('./*').click()
    time.sleep(1)

#testing balls
def ball_dropping(message, wall=False):
    if(wall):
        view_wall()
    else:
        view_friends_profile()
    browser.find_element_by_id("drop-a-ball").click()
    time.sleep(1)
    browser.find_element_by_id("message-input").clear()
    browser.find_element_by_id("message-input").send_keys(message)
    browser.find_element_by_id("ball-ready").click()
    time.sleep(1)


#testing chat
def chat(user, password, message, response):
    chat_partner = webdriver.WebDriver()
    chat_partner.get("localhost:3000")
    #logging in partner
    login(user, password, chat_partner)
    #start chat and send message
    find_user("Martin")
    browser.find_element_by_id("chat-button").click()
    active_chat = browser.find_element_by_class_name("active-chat")
    active_chat.find_element_by_class_name("chat-input").send_keys(message)
    active_chat.find_element_by_class_name("chat-post").click()

    #print the message and respond
    partner_chat = chat_partner.find_element_by_class_name("active-chat")
    message_box = partner_chat.find_element_by_class_name("message-container")
    print(message_box.find_element_by_xpath('./*[last()]').text)
    partner_chat.find_element_by_class_name("chat-input").send_keys(response)
    partner_chat.find_element_by_class_name("chat-post").click()

    invite_dan_to_chat()


def invite_dan_to_chat():
    dans_browser = webdriver.WebDriver()
    dans_browser.get("localhost:3000")
    #logging in partner
    login("danvarnamnet@gmail.com", "loppan", dans_browser)
    browser.find_element_by_class_name("invitebutton").click()
    time.sleep(1)
    browser.find_element_by_class_name("activefriend").click()
    active_chat = browser.find_element_by_class_name("active-chat")
    active_chat.find_element_by_class_name("chat-input").send_keys("oj missklick")
    active_chat.find_element_by_class_name("chat-post").click()


    dans_chat = dans_browser.find_element_by_class_name("active-chat")
    dans_chat.find_element_by_class_name("chat-input").send_keys("tjena grabbar! kul att man far vara med!")
    dans_chat.find_element_by_class_name("chat-post").click()

    active_chat.find_element_by_class_name("chat-input").send_keys("men stick dan, snalla")
    active_chat.find_element_by_class_name("chat-post").click()



browser = webdriver.WebDriver()
#Load the file with the webdriver
browser.get("localhost:3000")

#User testing
#registration
#user_registration("Ante", "antwa730@student.liu.se", "loppan", "lopan" )
#user_registration("Ante Wall", "antwa730@student.liu.se", "loppan", "loppan" )

#login/logout
#logout()
login("antwa730@student.liu.se", "loppan", browser)
#view_profile()
#view_friends()


#testing search

#find_user("Dan Andreasson")
#find_user("finns ej")


#testing friend adding
#add_friend("dan")
#remove_friend("dan Andrea")
#add_friend("Martin")

#view_friends()
#view_friends_profile()
#ball_dropping("a ball to a good friend")
#ball_dropping("wall ball", True)


chat("marli994@student.liu.se","loppan", "ping", "pong")




