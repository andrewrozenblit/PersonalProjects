# Network Security Monitor

A Python-based network security monitoring tool that detects and alerts on potentially malicious network traffic patterns. This tool can analyze both live network traffic and PCAP files to identify common security threats and suspicious activities.

## Features

The monitor detects and alerts on the following types of network activities:

- Port scanning techniques:
  - Null Scans (TCP flags = 0x000)
  - Xmas Scans (TCP flags = 0x029)
  - FIN Scans (TCP flags = 0x001)
- Web-based attacks:
  - Nikto web vulnerability scanner detection
  - Cleartext credentials in HTTP Basic Authentication
- Remote access protocols:
  - SMB traffic (ports 139/445)
  - RDP connections (port 3389)
  - VNC connections (port 5900)

## Prerequisites

- Python 3.x
- Scapy library
- Root/Administrator privileges (for live capture)

## Installation

1. Install Python 3.x if not already installed
2. Install the required dependencies:
   ```bash
   pip3 install scapy
   ```

## Usage

The program can be run in two modes:

### Live Capture Mode

To monitor live network traffic (requires root/administrator privileges):

```bash
sudo python3 alarm.py -i <interface_name>
```

Example:
```bash
sudo python3 alarm.py -i eth0
```

### PCAP Analysis Mode

To analyze a pre-recorded PCAP file:

```bash
python3 alarm.py -r <pcap_file>
```

Example:
```bash
python3 alarm.py -r capture.pcap
```

## Command Line Arguments

- `-i`: Specify the network interface to monitor (default: eth0)
- `-r`: Specify a PCAP file to analyze

## Alert Format

Alerts are displayed in the following format:

```
ALERT #<number>: <alert_type> from <source_ip> (<additional_info>)
```

Examples:
- `ALERT #1: Null Scan is detected from 192.168.1.100 (TCP)!`
- `ALERT #2: SMB is detected from 10.0.0.5 (445)!`
- `ALERT #3: Usernames and passwords sent in-the-clear (HTTP) (username:admin, password:123456)`

## Security Considerations

- The program requires root/administrator privileges for live packet capture
- Be aware that monitoring network traffic may be subject to legal restrictions in your jurisdiction
- This tool should be used only on networks you own or have explicit permission to monitor

## Limitations

- The program only analyzes TCP-based threats
- Some legitimate traffic might trigger alerts (false positives)
- The tool doesn't prevent attacks; it only detects and alerts on suspicious activities