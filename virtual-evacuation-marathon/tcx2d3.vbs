' tcx → d3変換

pathSrc = "20170226_001005.tcx"
pathDest = Replace(pathSrc, ".tcx", ".txt")


latTop = 35.704202
latTop = 35.804202

latBottom = 35.626812
lngLeft = 139.684303

lngRight = 139.781751
lngRight = 139.981751

width = 1200
height = 1200

Set dom = CreateObject("MSXML2.DomDocument")
Set fs = CreateObject("Scripting.FileSystemObject")

r = dom.load(pathSrc)

Set root = dom.documentElement

Set tpoints = root.getElementsByTagName("Position")
spoints = ""
npoints = 0
For Each tpoint In tpoints
  npoints = npoints + 1
Next

duration = CInt(npoints / 100)
if duration = 0 Then
  duration = 1
End If

i = 0
For Each tpoint In tpoints
  If i Mod duration = 0 Then
  
  If Len(spoints) = 0 Then
    spoints = spoints & "M"
  Else
    spoints = spoints & " L"
  End If
  lat = CDbl(tpoint.GetElementsByTagName("LatitudeDegrees").Item(0).Text)
  lng = CDbl(tpoint.GetElementsByTagName("LongitudeDegrees").Item(0).Text)
  x = ((lng - lngLeft) / (lngRight - lngLeft)) * width
  y = ((latTop - lat) / (latTop - latBottom)) * height
  If x < 0 Then
    x = 0
  End If
  If y < 0 Then
    y = 0
  End If
  If x > width Then
    x = width
  End If
  If y > height Then
    y = height
  End If 
  x = CInt(x)
  y = CInt(y)
  spoints = spoints & x & "," & y
  
  End If
  
  i = i + 1
Next

If fs.FileExists(pathDest) = True Then
  fs.DeleteFile(pathDest)
End If

Set ts = fs.CreateTextFile(pathDest)
ts.WriteLine(spoints)
ts.Close

