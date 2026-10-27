#!/usr/bin/env python3
"""Independent monetary oracle. Standard-library only. Reproducible synthetic cases."""
import json, random, subprocess, pathlib
from decimal import Decimal, ROUND_HALF_UP
root=pathlib.Path(__file__).resolve().parent.parent
rng=random.Random(5307)
def d(v):return Decimal(str(v))
def rnd(v,places=2):return d(v).quantize(Decimal(10)**-places,rounding=ROUND_HALF_UP)
cases=[]
for i in range(1500):
 currency=rng.choice(['USD','JPY','KWD'])
 o=dict(id='case',name='Synthetic',kind='service',unit='unit',price=rng.randrange(1000,100000)/100,discount=rng.choice([0,.05,.1,.125]),unitCost=rng.randrange(0,20000)/100,taxRate=rng.choice([0,.19]),feeRate=rng.choice([0,.025,.03]),feeFixed=rng.choice([0,.3]),commissionBasis=rng.choice(['none','sales','profit']),commissionRate=rng.choice([0,.15,.3,.5]),reserve=rng.randrange(0,1000)/100)
 cases.append({'o':o,'currency':currency})
js="const E=require('./src/engine');let raw='';process.stdin.on('data',x=>raw+=x);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(raw).map(x=>E.economics(x.o,x.currency)))));"
result=json.loads(subprocess.run(['node','-e',js],cwd=root,input=json.dumps(cases),text=True,capture_output=True,check=True).stdout)
checks=0
for x,actual in zip(cases,result):
 o=x['o'];places={'USD':2,'JPY':0,'KWD':3}[x['currency']]
 r=lambda v:rnd(v,places)
 net=r(r(o['price'])*(1-d(o['discount'])));cost=r(o['unitCost']);tax=r(net*d(o['taxRate']));fee=r((net+tax)*d(o['feeRate']))+r(o['feeFixed']);base=d(0) if o['commissionBasis']=='none' else net if o['commissionBasis']=='sales' else max(d(0),net-cost-fee-r(o['reserve']));comm=r(base*d(o['commissionRate']));expected=dict(net=net,cost=cost,tax=tax,fee=fee,base=base,commission=comm,contribution=net-cost-fee-comm)
 for k,v in expected.items():assert d(actual[k])==v,(k,actual[k],v,x);checks+=1
out=root/'.artifacts';out.mkdir(exist_ok=True)
report={'cases':len(cases),'comparisons':checks,'failures':0,'oracle':'Python Decimal / ROUND_HALF_UP','currencies':['USD','JPY','KWD']}
(out/'decimal-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
