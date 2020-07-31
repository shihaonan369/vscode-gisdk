#include <stdlib.h>
#include <iostream>
#include <Windows.h>

void DebugFile(LPCSTR lpszPath)
{

}

void DllCheckFile(LPCSTR lpszPath)
{

}

void FilterDllMsg(LPCSTR lpszMsg)
{

}

void HitBreakpoint(int line)
{

}

bool StartDebug()
{
    
}

void main() {
    auto hDll = LoadLibrary(TEXT("C:\\Program Files (x86)\\TransCAD 7.0\\GisdkDbg.dll"));
    auto pStartDebug = GetProcAddress(hDll, "StartDebug");
    bool bSuccess = pStartDebug();
    Sleep(1000*10);
    return;
}