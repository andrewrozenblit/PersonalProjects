#!/usr/bin/python3

from scapy.all import *
import argparse

incident_number = 1
def packetcallback(packet):
  try:
    # The following is an example of Scapy detecting HTTP traffic
    # Please remove this case in your actual lab implementation so it doesn't pollute the alerts
    # if packet[TCP].dport == 80:
      # print("HTTP (web) traffic detected!")
    
    #tracks the incident number 
    global incident_number

    #checks that the packet has a tcp layer 
    if packet.haslayer(TCP):
        tcp_layer = packet.getlayer(TCP)
        ip_layer = packet.getlayer(IP)
        src_ip = ip_layer.src
        if (tcp_layer.flags == 0x000) :
            print(f"ALERT #{incident_number}: #Null Scan is detected from {src_ip} (TCP)!")
            incident_number += 1
        elif (tcp_layer.flags == 0x029):
            print(f"ALERT #{incident_number}: #Xmas Scan is detected from {src_ip} (TCP)!")
            incident_number += 1
        elif (tcp_layer.flags == 0x001):
            print(f"ALERT #{incident_number}: #Fin Scan is detected from {src_ip} (TCP)!")
            incident_number += 1
        elif packet.haslayer(Raw):
            http_payload = packet[Raw].load.decode(errors='ignore')
            # print(http_payload)
            if "Nikto" in http_payload:
              print(f"ALERT # {incident_number}: #Nikto scan detected from {src_ip} (TCP)!")
              incident_number += 1
            elif "Authorization: Basic " in http_payload:
                # Extract the encoded part
                auth_header = http_payload.split("Authorization: Basic ")[1].split("\r\n")[0]
                # Decode the Base64 encoded credentials
                credentials = base64.b64decode(auth_header).decode('utf-8')
                username, password = credentials.split(':', 1)
                print(f"ALERT #{incident_number}: Usernames and passwords sent in-the-clear (HTTP) (username:{username}, password:{password})")
                incident_number += 1
        elif tcp_layer.dport in [139, 445]:
            if tcp_layer.dport == 139 or tcp_layer.sport == 139: port = 139
            else: port = 445
            print(f"ALERT #{incident_number}: #SMB is detected from {src_ip} ({port})!")
            incident_number += 1
        elif tcp_layer.dport == 3389: 
            print(f"ALERT #{incident_number}: #RDP is detected from {src_ip} (3389)!")
            incident_number += 1
        elif tcp_layer.dport == 5900: 
            print(f"ALERT #{incident_number}: #VNC is detected from {src_ip} (5900)!")
            incident_number += 1
  except Exception as e:
    # Uncomment the below and comment out `pass` for debugging, find error(s)
    print(e)
    #pass


# DO NOT MODIFY THE CODE BELOW
parser = argparse.ArgumentParser(description='A network sniffer that identifies basic vulnerabilities')
parser.add_argument('-i', dest='interface', help='Network interface to sniff on', default='eth0')
parser.add_argument('-r', dest='pcapfile', help='A PCAP file to read')
args = parser.parse_args()
if args.pcapfile:
  try:
    print("Reading PCAP file %(filename)s..." % {"filename" : args.pcapfile})
    sniff(offline=args.pcapfile, prn=packetcallback)    
  except:
    print("Sorry, something went wrong reading PCAP file %(filename)s!" % {"filename" : args.pcapfile})
else:
  print("Sniffing on %(interface)s... " % {"interface" : args.interface})
  try:
    sniff(iface=args.interface, prn=packetcallback)
  except:
    print("Sorry, can\'t read network traffic. Are you root?")