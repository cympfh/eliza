#!/usr/bin/python
# coding: utf-8

import sys
import smtplib
from email.Header import Header
from email.MIMEMultipart import MIMEMultipart
from email.MIMEImage import MIMEImage
from email.MIMEText import MIMEText

mine = "cympfh@gmail.com"

def create(subj, to, body):
  outer = MIMEMultipart()
  subj = subj.encode("iso-2022-jp")
  outer["Subject"] = Header(subj, "iso-2022-jp")
  outer["From"] = mine
  outer["To"] = to
  mainpart = MIMEText("", _charset="iso-2022-jp")
  mainpart.set_payload(body.encode("iso-2022-jp"))
  outer.attach(mainpart)
  return outer

def gmail(outer):
  s = smtplib.SMTP('smtp.gmail.com', 587)
  s.ehlo()
  s.starttls()
  s.ehlo()
  s.login(mine, 'qwer3der')
  s.sendmail(mine, to, outer.as_string())
  s.close()

def send_with_img(subj, to, body, filename):
  outer = create(subj, to, body)
  img = MIMEImage(open(filename).read())
  img.add_header("Content-Disposition", "attachmeent", filename=filename)
  outer.attach(img)
  gmail(outer)


def send(subj, to, body):
  gmail(create(subj, to, body))

if len(sys.argv) == 4:
  to    = unicode(sys.argv[1], "utf-8")
  title = unicode(sys.argv[2], "utf-8")
  body  = unicode(sys.argv[3], "utf-8")
  send(title, to, body)
  # send(u"たいとる", "cympfh@gmail.com", u"本文です", "test.png")
else:
  print "./% to title body"
