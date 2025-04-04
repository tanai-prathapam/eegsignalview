# eegsignalview
Dataflow:
Signals from electrodes -> connect to external ADC on circuit -> ADC converts analog values to 10-bit digital 0-1023 -> Raspberry Pi reads the 10-bit digital signal through SPI connection with ADC and outputs -> python code converts the digital number value to voltage (3.3V = 1023) 
